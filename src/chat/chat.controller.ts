import { Controller, Delete, Get, Param } from "@nestjs/common";

import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages() {
    return this.chatService.getMessages();
  }
   @Delete('messages/:id')
  async deleteMessage(@Param('id') id: string) {
    await this.chatService.deleteMessage(id);
    return { success: true };
    }

}
