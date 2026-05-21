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
exports.CvAssistantController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const gemini_service_1 = require("../gemini/gemini.service");
const translate_cv_dto_1 = require("./dto/translate-cv.dto");
const suggest_cv_dto_1 = require("./dto/suggest-cv.dto");
let CvAssistantController = class CvAssistantController {
    geminiService;
    constructor(geminiService) {
        this.geminiService = geminiService;
    }
    async translateCV(dto) {
        const translated = await this.geminiService.translateCV(dto.cvData, dto.targetLang, dto.sectionTitles);
        return { success: true, data: translated };
    }
    async suggestImprovements(dto, req) {
        const { cvData, prompt, section } = dto;
        const suggestions = await this.geminiService.suggestCVImprovements(cvData, prompt, section);
        return { success: true, data: suggestions };
    }
};
exports.CvAssistantController = CvAssistantController;
__decorate([
    (0, common_1.Post)('translate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [translate_cv_dto_1.TranslateCVDto]),
    __metadata("design:returntype", Promise)
], CvAssistantController.prototype, "translateCV", null);
__decorate([
    (0, common_1.Post)('suggest'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [suggest_cv_dto_1.SuggestCVDto, Object]),
    __metadata("design:returntype", Promise)
], CvAssistantController.prototype, "suggestImprovements", null);
exports.CvAssistantController = CvAssistantController = __decorate([
    (0, common_1.Controller)('cv-assistant'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gemini_service_1.GeminiService])
], CvAssistantController);
//# sourceMappingURL=cv-assistant.controller.js.map