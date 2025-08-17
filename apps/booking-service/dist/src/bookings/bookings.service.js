"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const bookings_module_1 = require("./bookings.module");
const ioredis_1 = require("ioredis");
const config_1 = require("../config");
const job_queue_1 = require("../queue/job-queue");
let BookingsService = class BookingsService {
    constructor(repo) {
        this.repo = repo;
        this.pub = new ioredis_1.Redis(config_1.config.redisUrl);
    }
    async create(input) {
        if (input.endTime <= input.startTime) {
            throw new common_1.ForbiddenException('endTime must be after startTime');
        }
        const created = await this.repo.create(input);
        // publish event
        await this.pub.publish('booking.created', JSON.stringify({ id: created.id, providerId: created.providerId, title: created.title, startTime: created.startTime, endTime: created.endTime }));
        // enqueue reminder 10 minutes before
        await (0, job_queue_1.enqueueReminder)({ bookingId: created.id, startTime: created.startTime });
        return created;
    }
    async getById(id, restrictToProviderId) {
        const found = await this.repo.findById(id);
        if (!found)
            throw new common_1.NotFoundException('Booking not found');
        if (restrictToProviderId && found.providerId !== restrictToProviderId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return found;
    }
    async listUpcoming(providerId, page = 1, limit = 20) {
        const now = new Date();
        return this.repo.listUpcoming(providerId, now, page, limit);
    }
    async listPast(providerId, page = 1, limit = 20) {
        const now = new Date();
        return this.repo.listPast(providerId, now, page, limit);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(bookings_module_1.BOOKINGS_REPO)),
    __metadata("design:paramtypes", [Object])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map