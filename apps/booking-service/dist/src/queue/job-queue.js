"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remindersQueue = void 0;
exports.enqueueReminder = enqueueReminder;
const bullmq_1 = require("bullmq");
const config_1 = require("../config");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default(config_1.config.redisUrl);
exports.remindersQueue = new bullmq_1.Queue('booking-reminders', {
    connection,
});
async function enqueueReminder(job) {
    const tenMinMs = 10 * 60 * 1000;
    const at = new Date(job.startTime).getTime() - tenMinMs;
    const delay = Math.max(0, at - Date.now());
    await exports.remindersQueue.add('reminder', job, { delay, removeOnComplete: true, removeOnFail: true });
}
//# sourceMappingURL=job-queue.js.map