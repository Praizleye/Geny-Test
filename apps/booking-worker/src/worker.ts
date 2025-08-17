import 'reflect-metadata';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { config } from './config';

const connection = new IORedis(config.redisUrl);

const worker = new Worker('booking-reminders', async (job: any) => {
  const { bookingId, startTime } = job.data as { bookingId: string; startTime: string | Date };
  const payload = { bookingId, startTime };
  await connection.publish('booking.reminder', JSON.stringify(payload));
  // eslint-disable-next-line no-console
  console.log('Sent booking.reminder', payload);
}, { connection });

worker.on('ready', () => console.log('booking-worker ready'));
worker.on('failed', (job: any, err: unknown) => console.error('job failed', job?.id, err));
