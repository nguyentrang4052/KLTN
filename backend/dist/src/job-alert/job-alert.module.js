"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobAlertModule = void 0;
const common_1 = require("@nestjs/common");
const job_alert_service_1 = require("./job-alert.service");
const job_alert_controller_1 = require("./job-alert.controller");
const prisma_module_1 = require("../../prisma/prisma.module");
const mail_module_1 = require("../mail/mail.module");
const notification_module_1 = require("../notification/notification.module");
let JobAlertModule = class JobAlertModule {
};
exports.JobAlertModule = JobAlertModule;
exports.JobAlertModule = JobAlertModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, mail_module_1.MailModule, notification_module_1.NotificationModule],
        providers: [job_alert_service_1.JobAlertService],
        controllers: [job_alert_controller_1.JobAlertController],
    })
], JobAlertModule);
//# sourceMappingURL=job-alert.module.js.map