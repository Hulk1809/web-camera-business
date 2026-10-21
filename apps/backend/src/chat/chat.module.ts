import { Module } from '@nestjs/common';
import { AdminChatController, CustomerChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  controllers: [CustomerChatController, AdminChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
