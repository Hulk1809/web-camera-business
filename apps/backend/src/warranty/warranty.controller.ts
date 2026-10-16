import { Controller, Get, Post, Body, Param, NotFoundException, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SerialStatus } from '@prisma/client';

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
          select: { name: true, sku: true, brand: { select: { name: true } } },
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

  @Get(':serialNumber')
  @ApiOperation({ summary: 'Tra cứu thông tin bảo hành máy ảnh/máy quay/DJI theo mã Serial' })
  async checkWarranty(@Param('serialNumber') serialNumber: string) {
    const cleanSn = serialNumber.trim().toUpperCase();
    const serial = await this.prisma.cameraSerial.findUnique({
      where: { serialNumber: cleanSn },
      include: {
        product: {
          include: { brand: true, category: true, images: { take: 1 } },
        },
        order: {
          select: { orderNumber: true, customerName: true, createdAt: true },
        },
      },
    });

    if (!serial) {
      throw new NotFoundException(`Không tìm thấy thông tin sản phẩm với số Serial: ${cleanSn}`);
    }

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
      orderNumber: serial.order?.orderNumber,
      isGenuine: true,
    };
  }
}
