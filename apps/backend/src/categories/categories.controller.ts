import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Categories & Brands')
@Controller()
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Lấy toàn bộ danh mục camera' })
  async getCategories() {
    return this.prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  @Get('brands')
  @ApiOperation({ summary: 'Lấy toàn bộ thương hiệu camera (Hikvision, Dahua, Ezviz, Imou...)' })
  async getBrands() {
    return this.prisma.brand.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  @Post('categories')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Tạo danh mục mới (Admin)' })
  async createCategory(@Body() body: { name: string; slug: string; description?: string; icon?: string }) {
    return this.prisma.category.create({ data: body });
  }
}
