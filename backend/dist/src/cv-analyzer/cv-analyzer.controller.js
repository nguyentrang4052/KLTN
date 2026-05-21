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
exports.CvAnalyzerController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const cv_analyzer_service_1 = require("./cv-analyzer.service");
const multer_1 = require("multer");
const path_1 = require("path");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const map_from_local_cv_dto_1 = require("./dto/map-from-local-cv.dto");
let CvAnalyzerController = class CvAnalyzerController {
    cvAnalyzerService;
    constructor(cvAnalyzerService) {
        this.cvAnalyzerService = cvAnalyzerService;
    }
    async analyzeCV(req, files, verify) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('No files uploaded');
        }
        const result = await this.cvAnalyzerService.analyzeMultipleCVs(files, req.user.sub, verify !== 'false');
        return {
            success: true,
            ...result,
        };
    }
    async getHistory(req) {
        const histories = await this.cvAnalyzerService.getUserCVHistory(req.user.sub);
        return {
            success: true,
            count: histories.length,
            data: histories.map(h => ({
                id: h.id,
                filename: h.filename,
                fullName: h.result?.personalInfo?.fullName || '',
                createdAt: h.createdAt,
            })),
        };
    }
    async mapToProfile(req, cvBuilderId) {
        const mapped = await this.cvAnalyzerService.mapCVToProfile(cvBuilderId, req.user.sub);
        return {
            success: true,
            message: 'Profile updated from CV Builder',
            data: mapped,
        };
    }
    async mapFromLocalCV(req, body) {
        const profile = await this.cvAnalyzerService.mapLocalCVToProfile(body, req.user.sub);
        return {
            success: true,
            message: 'Profile updated from local CV data',
            data: {
                fullName: profile.fullName,
                phone: profile.phone,
                address: profile.address,
                jobTitle: profile.jobTitle,
                experienceYear: profile.experienceYear,
                careerLevel: profile.careerLevel,
            },
        };
    }
    async getCVDetail(req, id) {
        const cv = await this.cvAnalyzerService.getCVById(parseInt(id), req.user.sub);
        if (!cv) {
            throw new common_1.BadRequestException('CV not found');
        }
        return {
            success: true,
            data: cv,
        };
    }
};
exports.CvAnalyzerController = CvAnalyzerController;
__decorate([
    (0, common_1.Post)('analyze'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `cv-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            const allowedMimes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
            if (allowedMimes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.BadRequestException('Only PDF, PNG, JPG files are allowed'), false);
            }
        },
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Query)('verify')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, String]),
    __metadata("design:returntype", Promise)
], CvAnalyzerController.prototype, "analyzeCV", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CvAnalyzerController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Post)('map-to-profile/:cvBuilderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('cvBuilderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], CvAnalyzerController.prototype, "mapToProfile", null);
__decorate([
    (0, common_1.Post)('map-from-local'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, map_from_local_cv_dto_1.MapFromLocalCvDto]),
    __metadata("design:returntype", Promise)
], CvAnalyzerController.prototype, "mapFromLocalCV", null);
__decorate([
    (0, common_1.Get)('detail/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CvAnalyzerController.prototype, "getCVDetail", null);
exports.CvAnalyzerController = CvAnalyzerController = __decorate([
    (0, common_1.Controller)('cv-analyzer'),
    __metadata("design:paramtypes", [cv_analyzer_service_1.CvAnalyzerService])
], CvAnalyzerController);
//# sourceMappingURL=cv-analyzer.controller.js.map