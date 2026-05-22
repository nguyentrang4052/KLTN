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
exports.SettingController = void 0;
const common_1 = require("@nestjs/common");
const setting_service_1 = require("./setting.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const change_pass_dto_1 = require("../dto/change-pass.dto");
let SettingController = class SettingController {
    constructor(settingService) {
        this.settingService = settingService;
    }
    changePassword(req, dto) {
        console.log('REQ USER:', req.user);
        return this.settingService.changePassword(req.user.sub, dto);
    }
};
exports.SettingController = SettingController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_pass_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], SettingController.prototype, "changePassword", null);
exports.SettingController = SettingController = __decorate([
    (0, common_1.Controller)('settings'),
    __metadata("design:paramtypes", [setting_service_1.SettingService])
], SettingController);
//# sourceMappingURL=setting.controller.js.map