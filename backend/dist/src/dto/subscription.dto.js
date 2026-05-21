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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefundDto = exports.ConfirmPaymentDto = exports.CancelSubscriptionDto = exports.CreateSubscriptionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSubscriptionDto {
    planName;
    billing;
    paymentMethod;
}
exports.CreateSubscriptionDto = CreateSubscriptionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "planName", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(['monthly', 'yearly']),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "billing", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSubscriptionDto.prototype, "paymentMethod", void 0);
class CancelSubscriptionDto {
    reason;
}
exports.CancelSubscriptionDto = CancelSubscriptionDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CancelSubscriptionDto.prototype, "reason", void 0);
class ConfirmPaymentDto {
    transactionRef;
    result;
}
exports.ConfirmPaymentDto = ConfirmPaymentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ConfirmPaymentDto.prototype, "transactionRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['success', 'failed']),
    __metadata("design:type", String)
], ConfirmPaymentDto.prototype, "result", void 0);
class RefundDto {
    reason;
    accountNumber;
    accountName;
    bankName;
}
exports.RefundDto = RefundDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundDto.prototype, "accountNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundDto.prototype, "accountName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RefundDto.prototype, "bankName", void 0);
//# sourceMappingURL=subscription.dto.js.map