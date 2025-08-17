"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("./config");
const connection = new ioredis_1.default(config_1.config.redisUrl);
const worker = new bullmq_1.Worker('booking-reminders', async (job) => {
    const { bookingId, startTime } = job.data;
    const payload = { bookingId, startTime };
    await connection.publish('booking.reminder', JSON.stringify(payload));
    // eslint-disable-next-line no-console
    console.log('Sent booking.reminder', payload);
}, { connection });
worker.on('ready', () => console.log('booking-worker ready'));
worker.on('failed', (job, err) => console.error('job failed', job?.id, err));
//# sourceMappingURL=worker.js.map