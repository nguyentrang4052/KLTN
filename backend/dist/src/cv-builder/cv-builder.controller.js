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
exports.CvBuilderController = void 0;
const common_1 = require("@nestjs/common");
const cv_builder_service_1 = require("./cv-builder.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
let CvBuilderController = class CvBuilderController {
    constructor(cvBuilderService) {
        this.cvBuilderService = cvBuilderService;
    }
    async getMyCVs(req) {
        return this.cvBuilderService.getByUser(req.user.sub);
    }
    async getDetail(req, id) {
        const cv = await this.cvBuilderService.getById(id, req.user.sub);
        if (!cv)
            throw new common_1.NotFoundException('CV not found');
        return cv;
    }
    async create(req, body) {
        return this.cvBuilderService.create(req.user.sub, body);
    }
    async update(req, id, body) {
        const updated = await this.cvBuilderService.update(id, req.user.sub, body);
        if (!updated)
            throw new common_1.NotFoundException('CV not found or not yours');
        return updated;
    }
    async delete(req, id) {
        const deleted = await this.cvBuilderService.delete(id, req.user.sub);
        if (!deleted)
            throw new common_1.NotFoundException('CV not found or not yours');
        return { success: true };
    }
};
exports.CvBuilderController = CvBuilderController;
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CvBuilderController.prototype, "getMyCVs", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CvBuilderController.prototype, "getDetail", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CvBuilderController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('update/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], CvBuilderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('delete/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CvBuilderController.prototype, "delete", null);
exports.CvBuilderController = CvBuilderController = __decorate([
    (0, common_1.Controller)('cv-builder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [cv_builder_service_1.CvBuilderService])
], CvBuilderController);
//# sourceMappingURL=cv-builder.controller.js.map