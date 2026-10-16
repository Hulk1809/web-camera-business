import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalProducts,
      lowStockProducts,
      totalOrders,
      todayOrders,
      paidOrders,
      recentOrders,
    ] = await Promise.all([
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({ where: { stockQuantity: { lte: 5 }, isActive: true } }),
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: today } } }),
      this.prisma.order.findMany({
        where: { paymentStatus: PaymentStatus.PAID },
        select: { totalAmount: true },
      }),
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
    ]);

    const totalRevenue = paidOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

    return {
      totalRevenue,
      totalOrders,
      todayOrders,
      totalProducts,
      lowStockCount: lowStockProducts,
      recentOrders,
    };
  }
}
