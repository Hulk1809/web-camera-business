import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus, Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService, private jwtService: JwtService) {}

  @Post()
  @ApiOperation({ summary: 'Khách hàng tạo đơn đặt mua máy ảnh, máy quay, DJI từ Storefront' })
  async create(@Body() body: any, @Req() request: any) {
    const token = this.extractToken(request);
    let userId: string | undefined;
    if (token) {
      try { userId = this.jwtService.verify(token)?.sub; } catch {}
    }
    return this.ordersService.create({ ...body, userId });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng cho Admin portal' })
  async findAll(@Query() query: any) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Tra cứu thông tin chi tiết đơn hàng theo ID hoặc OrderNumber' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post('lookup')
  @ApiOperation({ summary: 'Khách hàng tra cứu đơn bằng mã đơn và số điện thoại' })
  async lookup(@Body() body: { query: string; customerPhone: string }) {
    return this.ordersService.lookupForCustomer(body.query, body.customerPhone);
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

  private extractToken(request: any) {
    const bearer = request.headers?.authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (bearer) return bearer;
    const cookie = String(request.headers?.cookie || '').split(';').map((part) => part.trim())
      .find((part) => part.startsWith('progear_session='));
    return cookie ? decodeURIComponent(cookie.slice('progear_session='.length)) : undefined;
  }
}
