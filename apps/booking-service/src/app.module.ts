import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { HealthController } from './health/health.controller';
import { WsGateway } from './ws/ws.gateway';
import { RedisSubscriber } from './ws/redis-subscriber';

@Module({
  imports: [BookingsModule],
  controllers: [HealthController],
  providers: [WsGateway, RedisSubscriber],
})
export class AppModule {}
