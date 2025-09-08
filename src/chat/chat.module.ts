import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from '../chat/entities/chat.entity'; // importa tu entidad
import { ChatController } from './chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers:[ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
