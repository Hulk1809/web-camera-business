import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    this.connectWithRetry();
  }

  private async connectWithRetry(retries = 30, delay = 4000) {
    for (let i = 1; i <= retries; i++) {
      try {
        await this.$connect();
        this.logger.log('✅ Successfully connected to PostgreSQL Database');
        exec('npx prisma db push --skip-generate', (err) => {
          if (!err) {
            this.logger.log('✅ Database schema synchronized');
          }
        });
        return;
      } catch (error) {
        this.logger.warn(`⏳ Waiting for PostgreSQL database to be ready... Attempt ${i}/${retries}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    this.logger.error('❌ Could not connect to PostgreSQL after multiple retries');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
