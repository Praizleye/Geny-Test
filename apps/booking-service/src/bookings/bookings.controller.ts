import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, ListQueryDto } from './dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/roles.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  @Post()
  @Roles('provider', 'admin')
  async create(@Body() body: CreateBookingDto, @Req() req: any) {
    console.log("🚀 ~ BookingsController ~ create ~ body:", body)
    const user = req.user as { sub: string; roles: string[] };
    const providerId = user.roles.includes('provider') && !user.roles.includes('admin')
      ? user.sub
      : (body.providerId || user.sub);
    return await this.service.create({
      providerId,
      title: body.title,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    });
  }

  @Get(':id')
  @Roles('provider', 'admin')
  async getById(@Param('id') id: string, @Req() req: any) {
    const user = req.user as { sub: string; roles: string[] };
    const isAdmin = user.roles.includes('admin');
    return await this.service.getById(id, isAdmin ? undefined : user.sub);
  }

  @Get('upcoming/list')
  @Roles('provider', 'admin')
  async listUpcoming(@Query() q: ListQueryDto, @Req() req: any) {
    const user = req.user as { sub: string; roles: string[] };
    const providerId = user.roles.includes('admin') ? (q.providerId || user.sub) : user.sub;
    return await this.service.listUpcoming(providerId, q.page ?? 1, q.limit ?? 20);
  }

  @Get('past/list')
  @Roles('provider', 'admin')
  async listPast(@Query() q: ListQueryDto, @Req() req: any) {
    const user = req.user as { sub: string; roles: string[] };
    const providerId = user.roles.includes('admin') ? (q.providerId || user.sub) : user.sub;
    return await this.service.listPast(providerId, q.page ?? 1, q.limit ?? 20);
  }
}
