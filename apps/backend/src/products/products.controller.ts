import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách camera có phân trang, bộ lọc danh mục/giá/tìm kiếm' })
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('seed')
  @Post('seed')
  @ApiOperation({ summary: 'Khởi tạo dữ liệu camera và quản trị viên ban đầu vào PostgreSQL' })
  async seed() {
    return this.productsService.seed();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết camera theo slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm mới camera vào kho' })
  async create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin camera' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa camera khỏi hệ thống' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
