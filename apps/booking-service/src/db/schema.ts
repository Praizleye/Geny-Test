import { pgTable, uuid, timestamp, text, index } from 'drizzle-orm/pg-core';

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  providerId: text('provider_id').notNull(),
  title: text('title').notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('scheduled'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table: any) => ({
  providerIdx: index('bookings_provider_idx').on(table.providerId),
  startIdx: index('bookings_start_idx').on(table.startTime),
}));

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
