import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Warranty (Tra cứu bảo hành)')
@Controller('warranty')
export class WarrantyController {
  constructor(private prisma: PrismaService) {}

  @Get(':serialNumber')
  @ApiOperation({ summary: 'Tra cứu thông tin bảo hành camera theo mã Serial Number' })
  async checkWarranty(@Param('serialNumber') serialNumber: string) {
    const serial = await this.prisma.cameraSerial.findUnique({
      where: { serialNumber },
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
      throw new NotFoundException(`Không tìm thấy thông tin camera với số Serial ${serialNumber}`);
    }

    const now = new Date();
    const isExpired = serial.warrantyExpires ? now > serial.warrantyExpires : false;

    return {
      serialNumber: serial.serialNumber,
      status: serial.status,
      productName: serial.product.name,
      brand: serial.product.brand.name,
      warrantyMonths: serial.warrantyMonths,
      soldDate: serial.soldDate,
      warrantyExpires: serial.warrantyExpires,
      isExpired,
      orderNumber: serial.order?.orderNumber,
    };
  }
}
