import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../auth/roles.guard';
import { DrizzleBookingsRepository } from './drizzle.repository';
import { BOOKINGS_REPO } from './tokens';

@Module({
  imports: [AuthModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    { provide: BOOKINGS_REPO, useClass: DrizzleBookingsRepository },
    RolesGuard,
  ],
  exports: [BookingsService],
})
export class BookingsModule {}
