"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const common_module_1 = require("./common/common.module");
const auth_module_1 = require("./auth/auth.module");
const jobs_module_1 = require("./jobs/jobs.module");
const industries_module_1 = require("./industries/industries.module");
const companies_module_1 = require("./companies/companies.module");
const profile_module_1 = require("./profile/profile.module");
const job_alert_module_1 = require("./job-alert/job-alert.module");
const schedule_1 = require("@nestjs/schedule");
const setting_module_1 = require("./setting/setting.module");
const cv_analyzer_module_1 = require("./cv-analyzer/cv-analyzer.module");
const subscription_module_1 = require("./subscription/subscription.module");
const admin_module_1 = require("./admin/admin.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const chatbot_module_1 = require("./chatbot/chatbot.module");
const redis_module_1 = require("./redis/redis.module");
const chat_history_module_1 = require("./chatbot/chat-history/chat-history.module");
const cv_assistant_module_1 = require("./cv-assistant/cv-assistant.module");
const cv_builder_module_1 = require("./cv-builder/cv-builder.module");
const notification_module_1 = require("./notification/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            schedule_1.ScheduleModule.forRoot(),
            common_module_1.CommonModule,
            auth_module_1.AuthModule,
            jobs_module_1.JobsModule,
            industries_module_1.IndustriesModule,
            companies_module_1.CompaniesModule,
            profile_module_1.ProfileModule,
            setting_module_1.SettingModule,
            job_alert_module_1.JobAlertModule,
            cv_analyzer_module_1.CvAnalyzerModule,
            subscription_module_1.SubscriptionModule,
            admin_module_1.AdminModule,
            notification_module_1.NotificationModule,
            cache_manager_1.CacheModule.registerAsync({
                useFactory: async () => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        socket: {
                            host: 'localhost',
                            port: 6379,
                        },
                        ttl: 3600,
                    }),
                }),
            }),
            chatbot_module_1.ChatbotModule,
            redis_module_1.RedisModule,
            chat_history_module_1.ChatHistoryModule,
            cv_assistant_module_1.CvAssistantModule,
            cv_builder_module_1.CvBuilderModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map