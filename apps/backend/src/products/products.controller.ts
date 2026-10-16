import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thiết bị Pro Gear có phân trang, bộ lọc danh mục/giá/tìm kiếm' })
  async findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get('seed')
  @ApiOperation({ summary: 'Khởi tạo dữ liệu Pro Camera & DJI vào PostgreSQL (GET)' })
  async seedGet() {
    return this.productsService.seed();
  }

  @Post('seed')
  @ApiOperation({ summary: 'Khởi tạo dữ liệu Pro Camera & DJI vào PostgreSQL (POST)' })
  async seedPost() {
    return this.productsService.seed();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết thiết bị theo slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm mới thiết bị vào kho' })
  async create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin thiết bị' })
  async update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa thiết bị khỏi hệ thống' })
  async remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
