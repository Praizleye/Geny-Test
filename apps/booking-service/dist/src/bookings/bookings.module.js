"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = exports.BOOKINGS_REPO = void 0;
const common_1 = require("@nestjs/common");
const bookings_controller_1 = require("./bookings.controller");
const bookings_service_1 = require("./bookings.service");
const auth_module_1 = require("../auth/auth.module");
const roles_guard_1 = require("../auth/roles.guard");
const core_1 = require("@nestjs/core");
const drizzle_repository_1 = require("./drizzle.repository");
exports.BOOKINGS_REPO = Symbol('BOOKINGS_REPO');
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [bookings_controller_1.BookingsController],
        providers: [
            bookings_service_1.BookingsService,
            { provide: exports.BOOKINGS_REPO, useClass: drizzle_repository_1.DrizzleBookingsRepository },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
        ],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map