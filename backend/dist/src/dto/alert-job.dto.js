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
exports.RemoveAlertDto = exports.CreateAlertDto = void 0;
const class_validator_1 = require("class-validator");
class CreateAlertDto {
}
exports.CreateAlertDto = CreateAlertDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Từ khóa không được để trống.' }),
    (0, class_validator_1.MinLength)(2, { message: 'Từ khóa phải có ít nhất 2 ký tự.' }),
    (0, class_validator_1.MaxLength)(100, { message: 'Từ khóa không được vượt quá 100 ký tự.' }),
    __metadata("design:type", String)
], CreateAlertDto.prototype, "keyword", void 0);
class RemoveAlertDto {
}
exports.RemoveAlertDto = RemoveAlertDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Từ khóa không được để trống.' }),
    __metadata("design:type", String)
], RemoveAlertDto.prototype, "keyword", void 0);
//# sourceMappingURL=alert-job.dto.js.map