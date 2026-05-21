"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const jobs_controller_1 = require("./jobs.controller");
const jobs_service_1 = require("./jobs.service");
const ai_job_recommendation_service_1 = require("./ai-job-recommendation.service");
const gemini_module_1 = require("../gemini/gemini.module");
const prisma_module_1 = require("../../prisma/prisma.module");
const config_1 = require("@nestjs/config");
const jobs_gateway_1 = require("../websocket-gateway/jobs.gateway");
const jwt_1 = require("@nestjs/jwt");
const config_2 = require("@nestjs/config");
const subscription_module_1 = require("../subscription/subscription.module");
let JobsModule = class JobsModule {
};
exports.JobsModule = JobsModule;
exports.JobsModule = JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            config_1.ConfigModule,
            gemini_module_1.GeminiModule,
            subscription_module_1.SubscriptionModule,
            jwt_1.JwtModule.registerAsync({
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET'),
                }),
                inject: [config_2.ConfigService],
            }),
        ],
        controllers: [jobs_controller_1.JobsController],
        providers: [
            jobs_service_1.JobsService,
            ai_job_recommendation_service_1.AIRecommendationService,
            jobs_gateway_1.JobsGateway,
        ],
        exports: [jobs_service_1.JobsService, ai_job_recommendation_service_1.AIRecommendationService, jobs_gateway_1.JobsGateway],
    })
], JobsModule);
//# sourceMappingURL=jobs.module.js.map