import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { BOOKINGS_REPO } from './bookings.module';
import { IBookingsRepository } from './drizzle.repository';
import { ForbiddenException } from '@nestjs/common';

jest.mock('../queue/job-queue', () => ({ enqueueReminder: jest.fn().mockResolvedValue(undefined) }));
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({ publish: jest.fn().mockResolvedValue(1), quit: jest.fn() }));
});

describe('BookingsService', () => {
  let service: BookingsService;
  let repo: jest.Mocked<IBookingsRepository>;

  beforeEach(async () => {
    repo = {
      create: jest.fn(async (i) => ({
        id: 'id1', providerId: i.providerId, title: i.title, startTime: i.startTime, endTime: i.endTime,
        status: 'scheduled', createdAt: new Date(), updatedAt: new Date(),
      } as any)),
      findById: jest.fn(),
      listUpcoming: jest.fn(),
      listPast: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: BOOKINGS_REPO, useValue: repo },
      ],
    }).compile();

    service = module.get(BookingsService);
  });

  it('throws if endTime before startTime', async () => {
    await expect(service.create({ providerId: 'p1', title: 't', startTime: new Date('2025-01-01T10:00:00Z'), endTime: new Date('2025-01-01T09:59:00Z') }))
      .rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates and enqueues reminder', async () => {
    const start = new Date(Date.now() + 60_000);
    const created = await service.create({ providerId: 'p1', title: 't', startTime: start, endTime: new Date(start.getTime() + 30_000) });
    expect(created.id).toBe('id1');
    expect(repo.create).toHaveBeenCalled();
  });
});
