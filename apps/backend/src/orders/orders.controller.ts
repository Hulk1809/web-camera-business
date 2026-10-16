import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role, OrderStatus, PaymentStatus } from '@prisma/client';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Khách hàng tạo đơn đặt mua camera (Không bắt buộc login)' })
  async create(@Body() body: any) {
    return this.ordersService.create(body);
  }

  @Get()
  @ApiBearerAuth()
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

  @Patch(':id/status')
  @ApiBearerAuth()
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
