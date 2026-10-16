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
    if (!data.items || data.items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm');
    }

    // ACID Transaction: Kiểm tra tồn kho, trừ kho, tạo đơn hàng và các order items
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData: any[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Sản phẩm với ID ${item.productId} không tồn tại`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(`Sản phẩm ${product.name} chỉ còn ${product.stockQuantity} chiếc trong kho`);
        }

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;

        // Trừ tồn kho
        await tx.product.update({
          where: { id: product.id },
          data: { stockQuantity: { decrement: item.quantity } },
        });

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

  async updateStatus(id: string, status: OrderStatus, paymentStatus?: PaymentStatus) {
    return this.prisma.order.update({
      where: { id },
      data: {
        orderStatus: status,
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      include: { items: true },
    });
  }
}
