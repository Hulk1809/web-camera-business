import { BadRequestException, Controller, Get, Post, Body, Param, NotFoundException, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SerialStatus, PaymentMethod, PaymentStatus, OrderStatus, Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Warranty (Tra cứu & Quản lý Serial)')
@Controller('warranty')
export class WarrantyController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách mã Serial cho Admin' })
  async listAllSerials(@Query() query: any) {
    const serials = await this.prisma.cameraSerial.findMany({
      include: {
        product: {
          select: { name: true, sku: true, brand: { select: { name: true } }, price: true },
        },
        order: {
          select: { orderNumber: true, customerName: true, customerPhone: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return serials.map((s) => ({
      id: s.id,
      serialNumber: s.serialNumber,
      productName: s.product?.name || 'Sản phẩm Pro Gear',
      productSku: s.product?.sku || 'N/A',
      brand: s.product?.brand?.name || 'DJI / Sony',
      status: s.status,
      warrantyMonths: s.warrantyMonths,
      soldDate: s.soldDate,
      warrantyExpires: s.warrantyExpires,
      orderNumber: s.order?.orderNumber,
      customerName: s.order?.customerName,
      customerPhone: s.order?.customerPhone,
      price: s.product?.price || 0,
    }));
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Thêm mới mã Serial Number vào kho' })
  async createSerial(
    @Body() body: { productId: string; serialNumber: string; warrantyMonths?: number },
  ) {
    return this.prisma.cameraSerial.create({
      data: {
        productId: body.productId,
        serialNumber: body.serialNumber.trim().toUpperCase(),
        warrantyMonths: body.warrantyMonths || 24,
        status: SerialStatus.IN_STOCK,
      },
      include: { product: true },
    });
  }

  @Post('pos-sell')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Bán tại quầy Showroom (POS) & Kích hoạt bảo hành điện tử' })
  async sellSerialAtCounter(
    @Body()
    body: {
      serialNumber: string;
      customerName: string;
      customerPhone: string;
      paymentMethod?: string;
      price?: number;
      orderNumber?: string;
    },
  ) {
    const cleanSn = body.serialNumber.trim().toUpperCase();
    const now = new Date();
    const finalOrderNumber =
      body.orderNumber ||
      `POS-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
        .getDate()
        .toString()
        .padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    return this.prisma.$transaction(async (tx) => {
      const serial = await tx.cameraSerial.findUnique({
        where: { serialNumber: cleanSn },
        include: { product: true },
      });
      if (!serial) throw new NotFoundException(`Không tìm thấy mã Serial ${cleanSn} trong kho.`);
      if (serial.status !== SerialStatus.IN_STOCK) {
        throw new BadRequestException(`Serial ${cleanSn} đã được xuất bán hoặc không còn khả dụng.`);
      }

      const reserved = await tx.product.updateMany({
        where: { id: serial.productId, isActive: true, stockQuantity: { gte: 1 } },
        data: { stockQuantity: { decrement: 1 } },
      });
      if (reserved.count !== 1) throw new BadRequestException('Sản phẩm không còn tồn kho để xuất bán.');

      const expDate = new Date(now);
      expDate.setMonth(expDate.getMonth() + (serial.warrantyMonths || 24));
      const finalPrice = body.price ?? serial.product.price;
      const order = await tx.order.create({
        data: {
          orderNumber: finalOrderNumber,
          customerName: body.customerName.trim(),
          customerPhone: body.customerPhone.trim(),
          shippingAddress: 'Showroom Quầy Trực Tiếp (125 Điện Biên Phủ, P. Đa Kao, Q.1, TP.HCM)',
          totalAmount: finalPrice,
          paymentMethod: body.paymentMethod === 'COD' ? PaymentMethod.COD : PaymentMethod.VIETQR,
          paymentStatus: PaymentStatus.PAID,
          orderStatus: OrderStatus.COMPLETED,
          note: `[BÁN TẠI QUẦY POS] Bàn giao trực tiếp tại showroom. Serial: ${cleanSn}`,
          items: { create: { productId: serial.productId, productName: serial.product.name,
            productSku: serial.product.sku, price: finalPrice, quantity: 1, subtotal: finalPrice } },
        },
      });
      const updatedSerial = await tx.cameraSerial.update({
        where: { id: serial.id },
        data: { status: SerialStatus.SOLD, orderId: order.id, soldDate: now, warrantyExpires: expDate },
        include: { product: true, order: true },
      });
      return { success: true, serial: updatedSerial, order };
    });
  }

  @Get(':query')
  @ApiOperation({ summary: 'Tra cứu thông tin bảo hành theo Mã Đơn Hàng, Serial Number hoặc Số Điện Thoại' })
  async checkWarranty(@Param('query') query: string) {
    const cleanQuery = query.trim().toUpperCase();
    const cleanDigits = query.replace(/[\s\-\.]/g, '');
    const isPhone = cleanDigits.length >= 9 && /^[0-9]+$/.test(cleanDigits);

    // 1. First check if searching by Order Number
    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: cleanQuery, mode: 'insensitive' } },
          { id: cleanQuery },
        ],
      },
      include: {
        items: true,
        serialsAssigned: {
          include: { product: true },
        },
      },
    });

    if (order) {
      const isCompleted = order.orderStatus === OrderStatus.COMPLETED;
      const isPaid = order.paymentStatus === PaymentStatus.PAID || isCompleted;

      const itemsWithWarranty = await Promise.all(
        order.items.map(async (item) => {
          let assigned: any = order.serialsAssigned.find((s) => s.productId === item.productId);
          if (!assigned) {
            assigned = await this.prisma.cameraSerial.findFirst({
              where: {
                OR: [
                  { orderId: order.id },
                  { serialNumber: { contains: order.orderNumber } },
                ],
                productId: item.productId,
              },
              include: { product: true },
            });
          }

          const warrantyMonths = 24;
          const soldDate = order.createdAt;
          const expDate = new Date(soldDate);
          expDate.setMonth(expDate.getMonth() + warrantyMonths);
          const now = new Date();
          const daysRemaining = Math.max(0, Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
          const generatedSn =
            assigned?.serialNumber ||
            `${item.productSku || 'PRO'}-${order.orderNumber.replace(/[^a-zA-Z0-9]/g, '').slice(-4)}-VN`;

          return {
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku || 'PRO-GEAR',
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
            serialNumber: generatedSn,
            warrantyMonths,
            soldDate: soldDate.toLocaleDateString('vi-VN'),
            warrantyExpires: expDate.toLocaleDateString('vi-VN'),
            daysRemaining: isCompleted ? daysRemaining : warrantyMonths * 30,
            isActivated: isCompleted,
          };
        }),
      );

      return {
        type: 'ORDER_RESULT',
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt.toLocaleDateString('vi-VN'),
        isCompleted,
        isPaid,
        items: itemsWithWarranty,
        devices: itemsWithWarranty,
      };
    }

    // 2. If searching by phone
    if (isPhone) {
      const orders = await this.prisma.order.findMany({
        where: { customerPhone: { contains: cleanDigits } },
        include: {
          serialsAssigned: {
            include: { product: { include: { brand: true } } },
          },
        },
      });

      const devices = orders.flatMap((o) =>
        o.serialsAssigned.map((s) => ({
          serialNumber: s.serialNumber,
          productName: s.product.name,
          productSku: s.product.sku || 'PRO-GEAR',
          brand: s.product.brand?.name || 'Pro Gear',
          status: s.status,
          warrantyMonths: s.warrantyMonths,
          soldDate: s.soldDate,
          warrantyExpires: s.warrantyExpires,
          orderNumber: o.orderNumber,
        })),
      );

      return {
        type: 'PHONE_RESULT',
        phone: query,
        devices,
      };
    }

    // 3. Otherwise search by Serial Number
    const serial = await this.prisma.cameraSerial.findUnique({
      where: { serialNumber: cleanQuery },
      include: {
        product: {
          include: { brand: true, category: true },
        },
        order: {
          select: { orderNumber: true, customerName: true, customerPhone: true, createdAt: true },
        },
      },
    });

    if (!serial) {
      throw new NotFoundException(`Không tìm thấy thông tin sản phẩm với số Serial hoặc Mã Đơn: ${cleanQuery}`);
    }

    const isActivated = serial.status === SerialStatus.SOLD && !!serial.soldDate;
    const now = new Date();
    const isExpired = serial.warrantyExpires ? now > serial.warrantyExpires : false;

    return {
      serialNumber: serial.serialNumber,
      status: serial.status,
      productName: serial.product.name,
      productSku: serial.product.sku,
      brand: serial.product.brand.name,
      warrantyMonths: serial.warrantyMonths,
      soldDate: serial.soldDate,
      warrantyExpires: serial.warrantyExpires,
      isExpired,
      isActivated,
      orderNumber: serial.order?.orderNumber,
      customerName: serial.order?.customerName,
      customerPhone: serial.order?.customerPhone,
      isGenuine: true,
      type: isActivated ? 'SOLD_ACTIVE' : 'IN_STOCK',
      message: isActivated
        ? 'Sản phẩm chính hãng đang trong thời hạn bảo hành.'
        : 'Sản phẩm chính hãng Pro Gear đang lưu kho trên kệ showroom, chưa xuất bán nên chưa kích hoạt bảo hành điện tử.',
    };
  }
}
