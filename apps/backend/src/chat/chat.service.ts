import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatMessageSender, ChatSessionStatus, Prisma } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AdminSessionQueryDto, CreateChatSessionDto, MessageQueryDto } from './chat.dto';

const customerSelect = { id: true, displayName: true, email: true, phone: true } as const;
const assigneeSelect = { id: true, fullName: true } as const;
const messageSelect = {
  id: true,
  sender: true,
  content: true,
  createdAt: true,
  senderUser: { select: assigneeSelect },
} as const;
const sessionSelect = {
  id: true,
  status: true,
  subject: true,
  createdAt: true,
  updatedAt: true,
  closedAt: true,
  customer: { select: customerSelect },
  assignedUser: { select: assigneeSelect },
} as const;

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private async customerForToken(token?: string) {
    if (!token) throw new UnauthorizedException('Chat access token is required');
    const customer = await this.prisma.chatCustomer.findUnique({
      where: { accessTokenHash: this.hashToken(token) },
      select: customerSelect,
    });
    if (!customer) throw new UnauthorizedException('Invalid chat access token');
    return customer;
  }

  async createSession(dto: CreateChatSessionDto) {
    let accessToken: string | undefined;
    let customer: any;
    if (dto.accessToken) {
      customer = await this.customerForToken(dto.accessToken);
    } else {
      accessToken = randomBytes(32).toString('base64url');
      customer = await this.prisma.chatCustomer.create({
        data: {
          accessTokenHash: this.hashToken(accessToken),
          displayName: dto.displayName,
          email: dto.email,
          phone: dto.phone,
        },
        select: customerSelect,
      });
    }

    const session = await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const created = await tx.chatSession.create({
        data: { customerId: customer.id, subject: dto.subject },
        select: sessionSelect,
      });
      if (dto.initialMessage) {
        await tx.chatMessage.create({
          data: {
            sessionId: created.id,
            sender: ChatMessageSender.CUSTOMER,
            content: dto.initialMessage,
          },
        });
      }
      return created;
    });
    return { accessToken, session };
  }

  async resume(accessToken: string) {
    const customer = await this.customerForToken(accessToken);
    const sessions = await this.prisma.chatSession.findMany({
      where: { customerId: customer.id },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      select: sessionSelect,
    });
    return { customer, sessions };
  }

  async listCustomerSessions(token?: string) {
    const customer = await this.customerForToken(token);
    return this.prisma.chatSession.findMany({
      where: { customerId: customer.id },
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      select: sessionSelect,
    });
  }

  private async customerSession(token: string | undefined, sessionId: string) {
    const customer = await this.customerForToken(token);
    const session = await this.prisma.chatSession.findFirst({
      where: { id: sessionId, customerId: customer.id },
      select: sessionSelect,
    });
    if (!session) throw new NotFoundException('Chat session not found');
    return session;
  }

  private messageArgs(query: MessageQueryDto) {
    return {
      take: query.limit ?? 50,
      ...(query.after ? { cursor: { id: query.after }, skip: 1 } : {}),
      orderBy: [{ createdAt: 'asc' as const }, { id: 'asc' as const }],
      select: messageSelect,
    };
  }

  async getCustomerSession(token: string | undefined, sessionId: string, query: MessageQueryDto) {
    const session = await this.customerSession(token, sessionId);
    const messages = await this.prisma.chatMessage.findMany({
      where: { sessionId },
      ...this.messageArgs(query),
    });
    return { ...session, messages };
  }

  async sendCustomerMessage(token: string | undefined, sessionId: string, content: string) {
    const session = await this.customerSession(token, sessionId);
    if (session.status === ChatSessionStatus.CLOSED) {
      throw new BadRequestException('Chat session is closed');
    }
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const message = await tx.chatMessage.create({
        data: { sessionId, sender: ChatMessageSender.CUSTOMER, content },
        select: messageSelect,
      });
      await tx.chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
      return message;
    });
  }

  async listAdminSessions(userId: string, query: AdminSessionQueryDto) {
    return this.prisma.chatSession.findMany({
      where: {
        ...(query.status ? { status: query.status } : {}),
        ...(query.assignedToMe === 'true' ? { assignedUserId: userId } : {}),
      },
      take: query.limit ?? 50,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
      select: sessionSelect,
    });
  }

  async getAdminSession(sessionId: string, query: MessageQueryDto) {
    const session = await this.prisma.chatSession.findUnique({ where: { id: sessionId }, select: sessionSelect });
    if (!session) throw new NotFoundException('Chat session not found');
    const messages = await this.prisma.chatMessage.findMany({ where: { sessionId }, ...this.messageArgs(query) });
    return { ...session, messages };
  }

  async claim(sessionId: string, userId: string) {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const claimed = await tx.chatSession.updateMany({
        where: { id: sessionId, assignedUserId: null, status: ChatSessionStatus.WAITING },
        data: { assignedUserId: userId, status: ChatSessionStatus.ACTIVE },
      });
      if (claimed.count !== 1) {
        const existing = await tx.chatSession.findUnique({ where: { id: sessionId }, select: { assignedUserId: true } });
        if (!existing) throw new NotFoundException('Chat session not found');
        if (existing.assignedUserId === userId) return tx.chatSession.findUnique({ where: { id: sessionId }, select: sessionSelect });
        throw new ConflictException('Chat session was already claimed or is not waiting');
      }
      return tx.chatSession.findUnique({ where: { id: sessionId }, select: sessionSelect });
    });
  }

  async sendAdminMessage(sessionId: string, userId: string, content: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { assignedUserId: true, status: true },
    });
    if (!session) throw new NotFoundException('Chat session not found');
    if (session.assignedUserId !== userId) throw new ForbiddenException('Claim this chat session before replying');
    if (session.status === ChatSessionStatus.CLOSED) throw new BadRequestException('Chat session is closed');
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const message = await tx.chatMessage.create({
        data: { sessionId, sender: ChatMessageSender.STAFF, senderUserId: userId, content },
        select: messageSelect,
      });
      await tx.chatSession.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
      return message;
    });
  }

  async resolve(sessionId: string, userId: string, isAdmin: boolean) {
    const session = await this.prisma.chatSession.findUnique({ where: { id: sessionId }, select: { assignedUserId: true } });
    if (!session) throw new NotFoundException('Chat session not found');
    if (!isAdmin && session.assignedUserId !== userId) throw new ForbiddenException('Only the assigned staff can resolve this chat');
    return this.prisma.chatSession.update({
      where: { id: sessionId }, data: { status: ChatSessionStatus.CLOSED, closedAt: new Date() }, select: sessionSelect,
    });
  }
}
