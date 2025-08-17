"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const bookings_service_1 = require("./bookings.service");
const bookings_module_1 = require("./bookings.module");
const common_1 = require("@nestjs/common");
jest.mock('../queue/job-queue', () => ({ enqueueReminder: jest.fn().mockResolvedValue(undefined) }));
jest.mock('ioredis', () => {
    return jest.fn().mockImplementation(() => ({ publish: jest.fn().mockResolvedValue(1), quit: jest.fn() }));
});
describe('BookingsService', () => {
    let service;
    let repo;
    beforeEach(async () => {
        repo = {
            create: jest.fn(async (i) => ({
                id: 'id1', providerId: i.providerId, title: i.title, startTime: i.startTime, endTime: i.endTime,
                status: 'scheduled', createdAt: new Date(), updatedAt: new Date(),
            })),
            findById: jest.fn(),
            listUpcoming: jest.fn(),
            listPast: jest.fn(),
        };
        const module = await testing_1.Test.createTestingModule({
            providers: [
                bookings_service_1.BookingsService,
                { provide: bookings_module_1.BOOKINGS_REPO, useValue: repo },
            ],
        }).compile();
        service = module.get(bookings_service_1.BookingsService);
    });
    it('throws if endTime before startTime', async () => {
        await expect(service.create({ providerId: 'p1', title: 't', startTime: new Date('2025-01-01T10:00:00Z'), endTime: new Date('2025-01-01T09:59:00Z') }))
            .rejects.toBeInstanceOf(common_1.ForbiddenException);
    });
    it('creates and enqueues reminder', async () => {
        const start = new Date(Date.now() + 60_000);
        const created = await service.create({ providerId: 'p1', title: 't', startTime: start, endTime: new Date(start.getTime() + 30_000) });
        expect(created.id).toBe('id1');
        expect(repo.create).toHaveBeenCalled();
    });
});
//# sourceMappingURL=bookings.service.spec.js.map