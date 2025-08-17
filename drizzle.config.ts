import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export default {
  schema: './apps/booking-service/src/db/schema.ts',
  out: './apps/booking-service/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/bookings',
  },
} satisfies Config;
