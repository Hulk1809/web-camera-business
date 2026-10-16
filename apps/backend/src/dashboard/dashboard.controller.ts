import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Lấy các chỉ số thống kê doanh thu, đơn hàng, tồn kho cho Admin' })
  async getMetrics() {
    return this.dashboardService.getMetrics();
  }
}
