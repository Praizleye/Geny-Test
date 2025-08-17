"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookings = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.bookings = (0, pg_core_1.pgTable)('bookings', {
    id: (0, pg_core_1.uuid)('id').defaultRandom().primaryKey(),
    providerId: (0, pg_core_1.text)('provider_id').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    startTime: (0, pg_core_1.timestamp)('start_time', { withTimezone: true }).notNull(),
    endTime: (0, pg_core_1.timestamp)('end_time', { withTimezone: true }).notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('scheduled'),
    createdAt: (0, pg_core_1.timestamp)('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
    providerIdx: (0, pg_core_1.index)('bookings_provider_idx').on(table.providerId),
    startIdx: (0, pg_core_1.index)('bookings_start_idx').on(table.startTime),
}));
//# sourceMappingURL=schema.js.map