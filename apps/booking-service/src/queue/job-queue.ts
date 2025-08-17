import { Queue } from 'bullmq';
import { config } from '../config';
import IORedis from 'ioredis';

export type ReminderJob = {
  bookingId: string;
  startTime: Date;
};

const connection = new IORedis(config.redisUrl);
export const remindersQueue = new Queue<ReminderJob>('booking-reminders', {
  connection,
});

export async function enqueueReminder(job: ReminderJob) {
  const tenMinMs = 10 * 60 * 1000;
  const at = new Date(job.startTime).getTime() - tenMinMs;
  const delay = Math.max(0, at - Date.now());
  await remindersQueue.add('reminder', job, { delay, removeOnComplete: true, removeOnFail: true });
}
