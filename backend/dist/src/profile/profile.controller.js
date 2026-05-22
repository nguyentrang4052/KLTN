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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const profile_service_1 = require("./profile.service");
const profile_dto_1 = require("../dto/profile.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    getMyProfile(user) {
        return this.profileService.getProfileByAccountID(user.sub);
    }
    getAllSkills() {
        return this.profileService.getAllSkills();
    }
    getProfile(userID) {
        return this.profileService.getProfile(userID);
    }
    updateProfile(userID, dto) {
        return this.profileService.updateProfile(userID, dto);
    }
    uploadAvatar(userID, file) {
        return this.profileService.updateAvatar(Number(userID), file);
    }
    removeAvatar(userID) {
        return this.profileService.removeAvatar(userID);
    }
    updateUserProfile(userID, dto) {
        return this.profileService.updateUserProfile(userID, dto);
    }
    getSkills(userID) {
        return this.profileService.getSkills(userID);
    }
    addSkill(userID, skillID) {
        return this.profileService.addSkill(userID, skillID);
    }
    removeSkill(userID, skillID) {
        return this.profileService.removeSkill(userID, skillID);
    }
    getStats(userID) {
        return this.profileService.getStats(userID);
    }
    getInsights(userID) {
        return this.profileService.getInsights(userID);
    }
};
exports.ProfileController = ProfileController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getMyProfile", null);
__decorate([
    (0, common_1.Get)('skills/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getAllSkills", null);
__decorate([
    (0, common_1.Get)(':userID'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)(':userID'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, profile_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Post)(':userID/avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('userID')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "uploadAvatar", null);
__decorate([
    (0, common_1.Delete)(':userID/avatar'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "removeAvatar", null);
__decorate([
    (0, common_1.Put)(':userID/user-profile'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, profile_dto_1.UpdateUserProfileDto]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "updateUserProfile", null);
__decorate([
    (0, common_1.Get)(':userID/skills'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getSkills", null);
__decorate([
    (0, common_1.Post)(':userID/skills/:skillID'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('skillID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "addSkill", null);
__decorate([
    (0, common_1.Delete)(':userID/skills/:skillID'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('skillID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "removeSkill", null);
__decorate([
    (0, common_1.Get)(':userID/stats'),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':userID/insights'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userID', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfileController.prototype, "getInsights", null);
exports.ProfileController = ProfileController = __decorate([
    (0, common_1.Controller)('profile'),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
//# sourceMappingURL=profile.controller.js.map