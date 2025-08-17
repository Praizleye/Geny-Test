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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const dto_1 = require("./dto");
const roles_decorator_1 = require("../auth/roles.decorator");
const roles_guard_1 = require("../auth/roles.guard");
let BookingsController = class BookingsController {
    constructor(service) {
        this.service = service;
    }
    async create(body, req) {
        const user = req.user;
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
    async getById(id, req) {
        const user = req.user;
        const isAdmin = user.roles.includes('admin');
        return await this.service.getById(id, isAdmin ? undefined : user.sub);
    }
    async listUpcoming(q, req) {
        const user = req.user;
        const providerId = user.roles.includes('admin') ? (q.providerId || user.sub) : user.sub;
        return await this.service.listUpcoming(providerId, q.page ?? 1, q.limit ?? 20);
    }
    async listPast(q, req) {
        const user = req.user;
        const providerId = user.roles.includes('admin') ? (q.providerId || user.sub) : user.sub;
        return await this.service.listPast(providerId, q.page ?? 1, q.limit ?? 20);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('provider', 'admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)('provider', 'admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)('upcoming/list'),
    (0, roles_decorator_1.Roles)('provider', 'admin'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "listUpcoming", null);
__decorate([
    (0, common_1.Get)('past/list'),
    (0, roles_decorator_1.Roles)('provider', 'admin'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ListQueryDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "listPast", null);
exports.BookingsController = BookingsController = __decorate([
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(roles_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map