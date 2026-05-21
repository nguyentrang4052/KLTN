"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CvAnalyzerModule = void 0;
const common_1 = require("@nestjs/common");
const cv_analyzer_controller_1 = require("./cv-analyzer.controller");
const cv_analyzer_service_1 = require("./cv-analyzer.service");
const gemini_module_1 = require("../gemini/gemini.module");
const pdf_to_image_service_1 = require("./pdf-to-image.service");
const cv_analysis_repository_1 = require("./cv-analysis.repository");
const redis_module_1 = require("../redis/redis.module");
const prisma_module_1 = require("../../prisma/prisma.module");
let CvAnalyzerModule = class CvAnalyzerModule {
};
exports.CvAnalyzerModule = CvAnalyzerModule;
exports.CvAnalyzerModule = CvAnalyzerModule = __decorate([
    (0, common_1.Module)({
        imports: [gemini_module_1.GeminiModule, redis_module_1.RedisModule, prisma_module_1.PrismaModule],
        controllers: [cv_analyzer_controller_1.CvAnalyzerController],
        providers: [cv_analyzer_service_1.CvAnalyzerService, pdf_to_image_service_1.PdfToImageService, cv_analysis_repository_1.CVAnalysisRepository],
    })
], CvAnalyzerModule);
//# sourceMappingURL=cv-analyzer.module.js.map