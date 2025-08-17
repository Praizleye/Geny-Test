"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrizzleBookingsRepository = void 0;
const common_1 = require("@nestjs/common");
const schema_1 = require("../db/schema");
const client_1 = require("../db/client");
const drizzle_orm_1 = require("drizzle-orm");
let DrizzleBookingsRepository = class DrizzleBookingsRepository {
    async create(input) {
        const [row] = await client_1.db.insert(schema_1.bookings).values({
            providerId: input.providerId,
            title: input.title,
            startTime: input.startTime,
            endTime: input.endTime,
        }).returning();
        return row;
    }
    async findById(id) {
        const [row] = await client_1.db.select().from(schema_1.bookings).where((0, drizzle_orm_1.eq)(schema_1.bookings.id, id)).limit(1);
        return row ?? null;
    }
    async listUpcoming(providerId, now, page, limit) {
        const offset = (page - 1) * limit;
        const predicate = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.providerId, providerId), (0, drizzle_orm_1.gt)(schema_1.bookings.startTime, now));
        const items = await client_1.db.select().from(schema_1.bookings)
            .where(predicate)
            .orderBy(schema_1.bookings.startTime)
            .limit(limit)
            .offset(offset);
        const [{ value: total }] = await client_1.db
            .select({ value: (0, drizzle_orm_1.count)() })
            .from(schema_1.bookings)
            .where(predicate);
        return { items, total: Number(total) };
    }
    async listPast(providerId, now, page, limit) {
        const offset = (page - 1) * limit;
        const predicate = (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.bookings.providerId, providerId), (0, drizzle_orm_1.lt)(schema_1.bookings.startTime, now));
        const items = await client_1.db.select().from(schema_1.bookings)
            .where(predicate)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.bookings.startTime))
            .limit(limit)
            .offset(offset);
        const [{ value: total }] = await client_1.db
            .select({ value: (0, drizzle_orm_1.count)() })
            .from(schema_1.bookings)
            .where(predicate);
        return { items, total: Number(total) };
    }
};
exports.DrizzleBookingsRepository = DrizzleBookingsRepository;
exports.DrizzleBookingsRepository = DrizzleBookingsRepository = __decorate([
    (0, common_1.Injectable)()
], DrizzleBookingsRepository);
//# sourceMappingURL=drizzle.repository.js.map