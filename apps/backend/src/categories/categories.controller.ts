import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Categories & Brands')
@Controller()
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Lấy toàn bộ danh mục máy ảnh, máy quay, flycam DJI' })
  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  @Get('brands')
  @ApiOperation({ summary: 'Lấy toàn bộ thương hiệu (DJI, Sony, Canon, Fujifilm, Nikon, Blackmagic...)' })
  async getBrands() {
    return this.prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  @Post('categories')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục mới (Admin)' })
  async createCategory(@Body() body: { name: string; slug: string; description?: string; icon?: string }) {
    return this.prisma.category.create({ data: body });
  }
}
