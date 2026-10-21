import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Khách hàng tạo đơn đặt mua máy ảnh, máy quay, DJI từ Storefront' })
  async create(@Body() body: any) {
    return this.ordersService.create(body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng cho Admin portal' })
  async findAll(@Query() query: any) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tra cứu thông tin chi tiết đơn hàng theo ID hoặc OrderNumber' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Khách hàng hủy đơn đang chờ xử lý bằng số điện thoại đặt hàng' })
  async cancel(@Param('id') id: string, @Body() body: { customerPhone: string }) {
    return this.ordersService.cancelByCustomer(id, body.customerPhone);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng (Xác nhận, Đang giao, Đã giao...)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus; paymentStatus?: PaymentStatus },
  ) {
    return this.ordersService.updateStatus(id, body.status, body.paymentStatus);
  }
}
