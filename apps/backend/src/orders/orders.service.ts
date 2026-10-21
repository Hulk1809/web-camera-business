import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus, SerialStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    userId?: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    paymentMethod: any;
    note?: string;
    items: Array<{ productId: string; quantity: number }>;
  }) {
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    for (const item of data.items) {
      if (!item || typeof item.productId !== 'string' || !item.productId.trim() ||
          !Number.isSafeInteger(item.quantity) || item.quantity <= 0) {
        throw new BadRequestException('Sản phẩm phải có ID và số lượng nguyên dương');
      }
    }

    // ACID Transaction: Kiểm tra tồn kho, trừ kho, tạo đơn hàng và các order items
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new NotFoundException(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Sản phẩm ${product.name} chỉ còn ${product.stockQuantity} chiếc trong kho`);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        // Kiểm tra và trừ kho nguyên tử để các đơn đồng thời không bán vượt tồn.
        const reserved = await tx.product.updateMany({
          where: { id: product.id, isActive: true, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (reserved.count !== 1) {
          throw new BadRequestException(`Sản phẩm ${product.name} không còn đủ số lượng trong kho`);
        }

        orderItemsData.push({
          productId: product.id,
          productName: product.name,
          productSku: product.sku,
          price: product.price,
          quantity: item.quantity,
          subtotal,
        });
      }

      // Sinh mã đơn hàng ngẫu nhiên: CAM-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `CAM-${dateStr}-${randomCode}`;

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          shippingAddress: data.shippingAddress,
          paymentMethod: data.paymentMethod,
          note: data.note,
          totalAmount,
          orderStatus: OrderStatus.PENDING,
          paymentStatus: PaymentStatus.UNPAID,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      return order;
    });
  }

  async findAll(query: { status?: OrderStatus; search?: string; page?: number; limit?: number }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.orderStatus = query.status;
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { customerPhone: { contains: query.search } },
        { customerName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [total, items] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { items: true, serialsAssigned: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, page, limit, totalPages: Math.ceil(total / limit), items };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: {
        items: { include: { product: { include: { images: true } } } },
        serialsAssigned: true,
      },
    });
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return order;
  }

  async lookupForCustomer(query: string, customerPhone: string) {
    const normalizedPhone = String(customerPhone || '').replace(/\D/g, '');
    if (!query?.trim() || normalizedPhone.length < 9) throw new BadRequestException('Mã đơn và số điện thoại không hợp lệ');
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id: query.trim() }, { orderNumber: { equals: query.trim(), mode: 'insensitive' } }],
      },
      include: { items: true, serialsAssigned: true },
    });
    if (!order || order.customerPhone.replace(/\D/g, '') !== normalizedPhone) {
      throw new NotFoundException('Không tìm thấy đơn hàng khớp thông tin xác nhận');
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với mã: ${id}`);
    }

    const updatedPaymentStatus =
      paymentStatus || (status === OrderStatus.COMPLETED ? PaymentStatus.PAID : undefined);

    return this.prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: status,
        ...(updatedPaymentStatus ? { paymentStatus: updatedPaymentStatus } : {}),
      },
      include: { items: true, serialsAssigned: true },
    });
  }

  async cancelByCustomer(id: string, customerPhone: string) {
    const normalizedPhone = String(customerPhone || '').replace(/\D/g, '');
    if (normalizedPhone.length < 9) throw new BadRequestException('Số điện thoại xác nhận không hợp lệ');

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { OR: [{ id }, { orderNumber: id }] },
        include: { items: true },
      });
      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
      if (order.customerPhone.replace(/\D/g, '') !== normalizedPhone) {
        throw new BadRequestException('Số điện thoại không khớp với đơn hàng');
      }
      if (order.orderStatus !== OrderStatus.PENDING) {
        throw new BadRequestException('Chỉ có thể hủy đơn hàng đang chờ xử lý');
      }

      const cancelled = await tx.order.updateMany({
        where: { id: order.id, orderStatus: OrderStatus.PENDING },
        data: { orderStatus: OrderStatus.CANCELLED },
      });
      if (cancelled.count !== 1) throw new BadRequestException('Trạng thái đơn hàng vừa thay đổi, vui lòng tải lại');
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stockQuantity: { increment: item.quantity } },
        });
      }
      return tx.order.findUnique({ where: { id: order.id }, include: { items: true } });
    });
  }
}
