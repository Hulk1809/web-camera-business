import { Body, Controller, Get, Headers, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ChatService } from './chat.service';
import {
  AdminSessionQueryDto,
  CreateChatSessionDto,
  MessageQueryDto,
  ResumeChatDto,
  SendChatMessageDto,
} from './chat.dto';

@ApiTags('Customer chat')
@Controller('chat/customer')
export class CustomerChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('sessions')
  create(@Body() dto: CreateChatSessionDto) {
    return this.chat.createSession(dto);
  }

  @Post('resume')
  resume(@Body() dto: ResumeChatDto) {
    return this.chat.resume(dto.accessToken);
  }

  @Get('sessions')
  @ApiHeader({ name: 'x-chat-token', required: true })
  list(@Headers('x-chat-token') token?: string) {
    return this.chat.listCustomerSessions(token);
  }

  @Get('sessions/:id')
  @ApiHeader({ name: 'x-chat-token', required: true })
  get(@Headers('x-chat-token') token: string | undefined, @Param('id') id: string, @Query() query: MessageQueryDto) {
    return this.chat.getCustomerSession(token, id, query);
  }

  @Post('sessions/:id/messages')
  @ApiHeader({ name: 'x-chat-token', required: true })
  send(@Headers('x-chat-token') token: string | undefined, @Param('id') id: string, @Body() dto: SendChatMessageDto) {
    return this.chat.sendCustomerMessage(token, id, dto.content);
  }
}

@ApiTags('Admin chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.STAFF)
@Controller('chat/admin/sessions')
export class AdminChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  list(@Req() req: any, @Query() query: AdminSessionQueryDto) {
    return this.chat.listAdminSessions(req.user.id, query);
  }

  @Get(':id')
  get(@Param('id') id: string, @Query() query: MessageQueryDto) {
    return this.chat.getAdminSession(id, query);
  }

  @Post(':id/claim')
  claim(@Param('id') id: string, @Req() req: any) {
    return this.chat.claim(id, req.user.id);
  }

  @Post(':id/messages')
  send(@Param('id') id: string, @Req() req: any, @Body() dto: SendChatMessageDto) {
    return this.chat.sendAdminMessage(id, req.user.id, dto.content);
  }

  @Post(':id/resolve')
  resolve(@Param('id') id: string, @Req() req: any) {
    return this.chat.resolve(id, req.user.id, req.user.role === Role.ADMIN);
  }
}
