import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Message } from './entities/chat.entity';

interface Client {
  id: string;
  name: string;
}

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  private clients: Record<string, Client> = {};

  async saveMessage({ userId, name, message }: { userId: string; name: string; message: string }) {
    const msg = this.messageRepo.create({ userId, name, message });
    return await this.messageRepo.save(msg); // ⬅️ devuelve el mensaje con ID
  }

  async getMessages(): Promise<Message[]> {
    return this.messageRepo.find({ order: { timestamp: 'ASC' } });
  }

  async deleteMessage(id: string): Promise<void> {
    if (!id) throw new Error('ID requerido para borrar mensaje');
    await this.messageRepo.delete(id);
  }

  async findMessageById(id: string): Promise<Message | null> {
    if (!id) return null;
    return this.messageRepo.findOne({ where: { id } });
  }

  onClientConnected(client: Client) {
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }

  getClients() {
    return Object.values(this.clients);
  }
}