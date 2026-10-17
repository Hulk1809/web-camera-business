import { Controller, Get, Post, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SerialStatus, PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

@ApiTags('Warranty (Tra cứu & Quản lý Serial)')
@Controller('warranty')
export class WarrantyController {
  constructor(private prisma: PrismaService) {}

  @Get()
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
    const serial = await this.prisma.cameraSerial.findUnique({
      where: { serialNumber: cleanSn },
      include: { product: true },
    });

    if (!serial) {
      throw new NotFoundException(`Không tìm thấy mã Serial ${cleanSn} trong kho.`);
    }

    const now = new Date();
    const expDate = new Date(now);
    expDate.setMonth(expDate.getMonth() + (serial.warrantyMonths || 24));

    const finalOrderNumber =
      body.orderNumber ||
      `POS-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now
        .getDate()
        .toString()
        .padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalPrice = body.price || serial.product.price;

    // Create Order
    const order = await this.prisma.order.create({
      data: {
        orderNumber: finalOrderNumber,
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        shippingAddress: 'Showroom Quầy Trực Tiếp (125 Điện Biên Phủ, P. Đa Kao, Q.1, TP.HCM)',
        totalAmount: finalPrice,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.DELIVERED,
        note: `[BÁN TẠI QUẦY POS] Bàn giao trực tiếp tại showroom. Serial: ${cleanSn}`,
        items: {
          create: {
            productId: serial.productId,
            productName: serial.product.name,
            productSku: serial.product.sku,
            price: finalPrice,
            quantity: 1,
            subtotal: finalPrice,
          },
        },
      },
    });

    // Update Serial to SOLD & activate warranty
    const updatedSerial = await this.prisma.cameraSerial.update({
      where: { id: serial.id },
      data: {
        status: SerialStatus.SOLD,
        orderId: order.id,
        soldDate: now,
        warrantyExpires: expDate,
      },
      include: { product: true, order: true },
    });

    // Decrement stock
    await this.prisma.product.update({
      where: { id: serial.productId },
      data: {
        stockQuantity: {
          decrement: 1,
        },
      },
    });

    return {
      success: true,
      serial: updatedSerial,
      order,
    };
  }

  @Get(':query')
  @ApiOperation({ summary: 'Tra cứu thông tin bảo hành theo Serial Number hoặc Số Điện Thoại' })
  async checkWarranty(@Param('query') query: string) {
    const cleanQuery = query.trim().toUpperCase();
    const cleanDigits = query.replace(/[\s\-\.]/g, '');
    const isPhone = cleanDigits.length >= 9 && /^[0-9]+$/.test(cleanDigits);

    // If searching by phone
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

    // Otherwise search by Serial Number
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
      throw new NotFoundException(`Không tìm thấy thông tin sản phẩm với số Serial: ${cleanQuery}`);
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
