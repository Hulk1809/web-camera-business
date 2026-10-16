import { Module } from '@nestjs/common';
import { WarrantyController } from './warranty.controller';

@Module({
  controllers: [WarrantyController],
})
export class WarrantyModule {}
