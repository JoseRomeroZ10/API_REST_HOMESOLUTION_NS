import { Server, Socket } from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';

import { ChatService } from './chat.service';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const { name, token } = socket.handshake.auth;
      if (!name) {
        socket.disconnect();
        return;
      }

      this.chatService.onClientConnected({ id: socket.id, name });
      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients());
      });
    });
  }

  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;
    if (!message) return;

    const msg = await this.chatService.saveMessage({
      userId: client.id,
      name,
      message,
    });

    this.server.emit('on-message', msg); // ✅ incluye el id
  }

  @SubscribeMessage('delete-message')
  async handleDeleteMessage(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (!id) return;

    const message = await this.chatService.findMessageById(id);
    if (!message) return;

    if (message.userId !== client.id) return; // ✅ solo el autor puede borrar

    await this.chatService.deleteMessage(id);
    this.server.emit('on-message-deleted', id);
  }
}