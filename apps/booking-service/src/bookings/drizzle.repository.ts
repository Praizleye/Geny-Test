import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { bookings, Booking } from '../db/schema';
import { db } from '../db/client';
import { and, desc, eq, gt, lt, count } from 'drizzle-orm';
import { BOOKINGS_REPO } from './bookings.module';

export type CreateBookingInput = {
  providerId: string;
  title: string;
  startTime: Date;
  endTime: Date;
};

export interface IBookingsRepository {
  create(input: CreateBookingInput): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  listUpcoming(providerId: string, now: Date, page: number, limit: number): Promise<{ items: Booking[]; total: number }>;
  listPast(providerId: string, now: Date, page: number, limit: number): Promise<{ items: Booking[]; total: number }>;
}

@Injectable()
export class DrizzleBookingsRepository implements IBookingsRepository {
  async create(input: CreateBookingInput): Promise<Booking> {
    const [row] = await db.insert(bookings).values({
      providerId: input.providerId,
      title: input.title,
      startTime: input.startTime,
      endTime: input.endTime,
    }).returning();
    return row;
  }

  async findById(id: string): Promise<Booking | null> {
    const [row] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return row ?? null;
  }

  async listUpcoming(providerId: string, now: Date, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const predicate = and(eq(bookings.providerId, providerId), gt(bookings.startTime, now));
    const items = await db.select().from(bookings)
      .where(predicate)
      .orderBy(bookings.startTime)
      .limit(limit)
      .offset(offset);
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(bookings)
      .where(predicate);
    return { items, total: Number(total) };
  }

  async listPast(providerId: string, now: Date, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const predicate = and(eq(bookings.providerId, providerId), lt(bookings.startTime, now));
    const items = await db.select().from(bookings)
      .where(predicate)
      .orderBy(desc(bookings.startTime))
      .limit(limit)
      .offset(offset);
    const [{ value: total }] = await db
      .select({ value: count() })
      .from(bookings)
      .where(predicate);
    return { items, total: Number(total) };
  }
}
