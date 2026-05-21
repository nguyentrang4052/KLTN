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
exports.JobAlertController = void 0;
const common_1 = require("@nestjs/common");
const job_alert_service_1 = require("./job-alert.service");
const alert_job_dto_1 = require("../dto/alert-job.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let JobAlertController = class JobAlertController {
    jobAlertService;
    constructor(jobAlertService) {
        this.jobAlertService = jobAlertService;
    }
    createAlert(user, dto) {
        return this.jobAlertService.createAlert(user.sub, dto.keyword);
    }
    removeAlert(user, dto) {
        return this.jobAlertService.unsubscribe(user.sub, dto.keyword);
    }
    getAlerts(user) {
        return this.jobAlertService.getAlertsByAccount(user.sub);
    }
};
exports.JobAlertController = JobAlertController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, alert_job_dto_1.CreateAlertDto]),
    __metadata("design:returntype", void 0)
], JobAlertController.prototype, "createAlert", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, alert_job_dto_1.RemoveAlertDto]),
    __metadata("design:returntype", void 0)
], JobAlertController.prototype, "removeAlert", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobAlertController.prototype, "getAlerts", null);
exports.JobAlertController = JobAlertController = __decorate([
    (0, common_1.Controller)('job-alerts'),
    __metadata("design:paramtypes", [job_alert_service_1.JobAlertService])
], JobAlertController);
//# sourceMappingURL=job-alert.controller.js.map