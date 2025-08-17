import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { config } from '../config';
import { WsGateway } from './ws.gateway';

@Injectable()
export class RedisSubscriber implements OnModuleInit, OnModuleDestroy {
  private sub = new Redis(config.redisUrl);

  constructor(private readonly ws: WsGateway) {}

  async onModuleInit() {
    await this.sub.subscribe('booking.created', 'booking.reminder');
    this.sub.on('message', (channel, message) => {
      try {
        const payload = JSON.parse(message);
        this.ws.emit(channel, payload);
      } catch {
        this.ws.emit(channel, message);
      }
    });
  }

  async onModuleDestroy() {
    await this.sub.quit();
  }
}
