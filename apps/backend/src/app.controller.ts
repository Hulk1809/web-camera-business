import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Liveness & Readiness probe' })
  checkHealth() {
    return {
      status: 'ok',
      service: 'camera-backend',
      timestamp: new Date().toISOString(),
    };
  }
}
