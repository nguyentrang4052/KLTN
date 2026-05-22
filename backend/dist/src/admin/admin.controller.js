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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const admin_dto_1 = require("../dto/admin.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    getStats() {
        return this.adminService.getStats();
    }
    getMonthlyRegistrations() {
        return this.adminService.getMonthlyRegistrations();
    }
    getWeeklyStatus() {
        return this.adminService.getWeeklyStatus();
    }
    getPlanDistribution() {
        return this.adminService.getPlanDistribution();
    }
    getRecentUsers() {
        return this.adminService.getRecentUsers();
    }
    getUsers() {
        return this.adminService.getUsers();
    }
    toggleStatus(id) {
        return this.adminService.toggleStatus(id);
    }
    getIndustries() {
        return this.adminService.getIndustries();
    }
    createIndustry(dto) {
        return this.adminService.createIndustry(dto);
    }
    updateIndustry(id, dto) {
        return this.adminService.updateIndustry(id, dto);
    }
    deleteIndustry(id) {
        return this.adminService.deleteIndustry(id);
    }
    getAllSkills() {
        return this.adminService.getAllSkills();
    }
    createSkill(dto) {
        return this.adminService.createSkill(dto);
    }
    updateSkill(id, dto) {
        return this.adminService.updateSkill(id, dto);
    }
    deleteSkill(id) {
        return this.adminService.deleteSkill(id);
    }
    getPackages() {
        return this.adminService.getPackages();
    }
    createPackage(dto) {
        return this.adminService.createPackage(dto);
    }
    getPlatforms() {
        return this.adminService.getPlatforms();
    }
    getIndustriesByPlatform(platform) {
        return this.adminService.getIndustriesByPlatform(platform);
    }
    getRefunds(status) {
        return this.adminService.getRefundRequests(status);
    }
    updatePackage(id, dto) {
        return this.adminService.updatePackage(id, dto);
    }
    deletePackage(id) {
        return this.adminService.deletePackage(id);
    }
    resolveRefund(id, body) {
        return this.adminService.resolveRefund(id, body.action, body.note);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('stats/monthly-registrations'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMonthlyRegistrations", null);
__decorate([
    (0, common_1.Get)('stats/weekly-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getWeeklyStatus", null);
__decorate([
    (0, common_1.Get)('stats/plan-distribution'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPlanDistribution", null);
__decorate([
    (0, common_1.Get)('recent-users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRecentUsers", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/toggle-status'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Get)('industries'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getIndustries", null);
__decorate([
    (0, common_1.Post)('industries'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateIndustryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createIndustry", null);
__decorate([
    (0, common_1.Put)('industries/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, admin_dto_1.UpdateIndustryDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateIndustry", null);
__decorate([
    (0, common_1.Delete)('industries/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteIndustry", null);
__decorate([
    (0, common_1.Get)('skills'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAllSkills", null);
__decorate([
    (0, common_1.Post)('skills'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreateSkillDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createSkill", null);
__decorate([
    (0, common_1.Put)('skills/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, admin_dto_1.UpdateSkillDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateSkill", null);
__decorate([
    (0, common_1.Delete)('skills/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteSkill", null);
__decorate([
    (0, common_1.Get)('packages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPackages", null);
__decorate([
    (0, common_1.Post)('packages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_dto_1.CreatePackageDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createPackage", null);
__decorate([
    (0, common_1.Get)('platforms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPlatforms", null);
__decorate([
    (0, common_1.Get)('industries/by-platform'),
    __param(0, (0, common_1.Query)('platform')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getIndustriesByPlatform", null);
__decorate([
    (0, common_1.Get)('refunds'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRefunds", null);
__decorate([
    (0, common_1.Put)('packages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, admin_dto_1.UpdatePackageDto]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updatePackage", null);
__decorate([
    (0, common_1.Delete)('packages/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deletePackage", null);
__decorate([
    (0, common_1.Patch)('refunds/:id/resolve'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "resolveRefund", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map