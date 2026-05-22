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
exports.JobsController = void 0;
const common_1 = require("@nestjs/common");
const jobs_service_1 = require("./jobs.service");
const ai_job_recommendation_service_1 = require("./ai-job-recommendation.service");
const jobs_dto_1 = require("../dto/jobs.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const optional_jwt_1 = require("../guards/optional-jwt");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const jobs_gateway_1 = require("../websocket-gateway/jobs.gateway");
const subscription_service_1 = require("../subscription/subscription.service");
let JobsController = class JobsController {
    constructor(jobsService, aiRecommendation, jobsGateway, subscriptionService) {
        this.jobsService = jobsService;
        this.aiRecommendation = aiRecommendation;
        this.jobsGateway = jobsGateway;
        this.subscriptionService = subscriptionService;
    }
    getJobs(dto, req) {
        return this.jobsService.getJobs(dto, req.user?.sub ?? undefined);
    }
    getUserStats(user) {
        return this.jobsService.getUserStats(user.sub);
    }
    async getRecommendations(user) {
        return this.jobsService.getRecommendations(user.sub, false);
    }
    async refreshRecommendations(user) {
        const hasChanged = await this.aiRecommendation.computeAndSaveRecommendations(user.sub);
        const result = await this.jobsService.getRecommendations(user.sub, hasChanged);
        return {
            ...result,
            hasChanged,
            message: hasChanged
                ? 'Đã cập nhật đề xuất mới!'
                : 'Không có đề xuất mới. Hãy cập nhật thêm kỹ năng hoặc xem thêm việc làm để AI học được sở thích của bạn.',
        };
    }
    getSavedJobs(dto, user) {
        return this.jobsService.getSavedJobs(dto, user.sub);
    }
    getFilterBySource(source) {
        return this.jobsService.getFilterOptionsBySource(source);
    }
    getFilterOptions() {
        return this.jobsService.getFilterOptions();
    }
    getTrendingKeywords() {
        return this.jobsService.getTrendingKeywords();
    }
    async saveSearchHistory(keyword, req) {
        if (!keyword?.trim() || !req.user?.sub)
            return;
        await this.jobsService.saveSearchHistory(req.user.sub, keyword.trim());
    }
    async getSearchHistory(user) {
        return this.jobsService.getSearchHistory(user.sub);
    }
    async getSearchSuggestions(q) {
        return this.jobsService.getSearchSuggestions(q);
    }
    broadcastNewJobs(count, secret) {
        if (secret !== process.env.INTERNAL_SECRET)
            return;
        this.jobsGateway.broadcastNewJobs(count);
        return { ok: true };
    }
    getIndustryTrends() {
        return this.jobsService.getIndustryTrends();
    }
    getJobById(id) {
        return this.jobsService.getJobById(id);
    }
    trackBehavior(jobID, action, user) {
        const allowedActions = ['view', 'save', 'apply', 'click'];
        const validAction = allowedActions.includes(action) ? action : 'view';
        return this.jobsService.logUserBehavior(user.sub, jobID, validAction);
    }
    getJobMatch(jobID, user) {
        return this.jobsService.getJobMatchPreview(user.sub, jobID);
    }
    async checkJobMatchDetail(jobID, user) {
        await this.subscriptionService.checkAndConsumeQuota(user.sub, 'cvMatchCheck');
        return this.jobsService.getJobMatchDetail(user.sub, jobID);
    }
    saveJob(jobID, user) {
        return this.jobsService.saveJob(user.sub, jobID);
    }
    unsaveJob(jobID, user) {
        return this.jobsService.unsaveJob(user.sub, jobID);
    }
};
exports.JobsController = JobsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_1.OptionalJwtGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jobs_dto_1.QueryJobsDto, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getJobs", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.Get)('recommendations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getRecommendations", null);
__decorate([
    (0, common_1.Post)('recommendations/refresh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "refreshRecommendations", null);
__decorate([
    (0, common_1.Get)('saved'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jobs_dto_1.QueryJobsDto, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getSavedJobs", null);
__decorate([
    (0, common_1.Get)('filter-by-source'),
    __param(0, (0, common_1.Query)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getFilterBySource", null);
__decorate([
    (0, common_1.Get)('filter-options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getFilterOptions", null);
__decorate([
    (0, common_1.Get)('trending-keywords'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getTrendingKeywords", null);
__decorate([
    (0, common_1.Post)('search-history'),
    (0, common_1.UseGuards)(optional_jwt_1.OptionalJwtGuard),
    __param(0, (0, common_1.Body)('keyword')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "saveSearchHistory", null);
__decorate([
    (0, common_1.Get)('search-history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getSearchHistory", null);
__decorate([
    (0, common_1.Get)('search-suggestions'),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "getSearchSuggestions", null);
__decorate([
    (0, common_1.Post)('internal/broadcast-new-jobs'),
    __param(0, (0, common_1.Body)('count')),
    __param(1, (0, common_1.Body)('secret')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "broadcastNewJobs", null);
__decorate([
    (0, common_1.Get)('industry-trends'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getIndustryTrends", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getJobById", null);
__decorate([
    (0, common_1.Post)(':id/track'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('action')),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "trackBehavior", null);
__decorate([
    (0, common_1.Get)(':id/match'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "getJobMatch", null);
__decorate([
    (0, common_1.Post)(':id/match/check'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], JobsController.prototype, "checkJobMatchDetail", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':jobID/save'),
    __param(0, (0, common_1.Param)('jobID', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "saveJob", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':jobID/save'),
    __param(0, (0, common_1.Param)('jobID', common_1.ParseIntPipe)),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], JobsController.prototype, "unsaveJob", null);
exports.JobsController = JobsController = __decorate([
    (0, common_1.Controller)('jobs'),
    __metadata("design:paramtypes", [jobs_service_1.JobsService,
        ai_job_recommendation_service_1.AIRecommendationService,
        jobs_gateway_1.JobsGateway,
        subscription_service_1.SubscriptionService])
], JobsController);
//# sourceMappingURL=jobs.controller.js.map