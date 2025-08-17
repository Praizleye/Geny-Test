import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { BOOKINGS_REPO } from './bookings.module';
import { IBookingsRepository, CreateBookingInput } from './drizzle.repository';
import Redis from 'ioredis';
import { config } from '../config';
import { enqueueReminder } from '../queue/job-queue';

@Injectable()
export class BookingsService {
  private pub = new Redis(config.redisUrl);

  constructor(@Inject(BOOKINGS_REPO) private readonly repo: IBookingsRepository) {}

  async create(input: CreateBookingInput) {
    if (input.endTime <= input.startTime) {
      throw new ForbiddenException('endTime must be after startTime');
    }
    const created = await this.repo.create(input);
    // publish event
    await this.pub.publish('booking.created', JSON.stringify({ id: created.id, providerId: created.providerId, title: created.title, startTime: created.startTime, endTime: created.endTime }));
    // enqueue reminder 10 minutes before
    await enqueueReminder({ bookingId: created.id, startTime: created.startTime });
    return created;
  }

  async getById(id: string, restrictToProviderId?: string) {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Booking not found');
    if (restrictToProviderId && found.providerId !== restrictToProviderId) {
      throw new ForbiddenException('Access denied');
    }
    return found;
  }

  async listUpcoming(providerId: string, page = 1, limit = 20) {
    const now = new Date();
    return this.repo.listUpcoming(providerId, now, page, limit);
  }

  async listPast(providerId: string, page = 1, limit = 20) {
    const now = new Date();
    return this.repo.listPast(providerId, now, page, limit);
  }
}
