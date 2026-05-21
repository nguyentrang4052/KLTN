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
exports.ChatHistoryController = void 0;
const common_1 = require("@nestjs/common");
const chat_history_service_1 = require("./chat-history.service");
const create_session_dto_1 = require("./dto/create-session.dto");
const save_message_dto_1 = require("./dto/save-message.dto");
const jwt_auth_guard_1 = require("../../guards/jwt-auth.guard");
const rename_session_dto_1 = require("./dto/rename-session.dto");
const pin_session_dto_1 = require("./dto/pin-session.dto");
let ChatHistoryController = class ChatHistoryController {
    chatHistoryService;
    constructor(chatHistoryService) {
        this.chatHistoryService = chatHistoryService;
    }
    getSessions(req) {
        return this.chatHistoryService.findSessionByUser(req.user?.sub);
    }
    createSession(req, dto) {
        return this.chatHistoryService.createSession({ ...dto, userID: req.user?.sub });
    }
    getMessages(sessionID) {
        return this.chatHistoryService.findMessagesBySession(sessionID);
    }
    saveMessage(dto) {
        return this.chatHistoryService.saveMessage(dto);
    }
    deleteSession(sessionID) {
        return this.chatHistoryService.deleteSession(sessionID);
    }
    renameSession(sessionID, dto, req) {
        return this.chatHistoryService.renameSession(sessionID, dto.title, req.user?.sub);
    }
    pinSession(sessionID, dto, req) {
        return this.chatHistoryService.pinSession(sessionID, dto.isPinned, req.user?.sub);
    }
};
exports.ChatHistoryController = ChatHistoryController;
__decorate([
    (0, common_1.Get)('get-sessions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Post)('create-sessions'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_session_dto_1.CreateSessionDto]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "createSession", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionID/messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('save-messages'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [save_message_dto_1.SaveMessageDto]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "saveMessage", null);
__decorate([
    (0, common_1.Post)('delete-session/:sessionID'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "deleteSession", null);
__decorate([
    (0, common_1.Put)('rename-session/:sessionID'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionID')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, rename_session_dto_1.RenameSessionDto, Object]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "renameSession", null);
__decorate([
    (0, common_1.Put)('pin-session/:sessionID'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('sessionID')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pin_session_dto_1.PinSessionDto, Object]),
    __metadata("design:returntype", void 0)
], ChatHistoryController.prototype, "pinSession", null);
exports.ChatHistoryController = ChatHistoryController = __decorate([
    (0, common_1.Controller)('chat-history'),
    __metadata("design:paramtypes", [chat_history_service_1.ChatHistoryService])
], ChatHistoryController);
//# sourceMappingURL=chat-history.controller.js.map