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
exports.CVAnalysisResultDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PersonalInfo {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfo.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfo.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfo.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfo.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfo.prototype, "linkedin", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PersonalInfo.prototype, "portfolio", void 0);
class Experience {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Experience.prototype, "company", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Experience.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Experience.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Experience.prototype, "description", void 0);
class Education {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Education.prototype, "institution", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Education.prototype, "degree", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Education.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Education.prototype, "gpa", void 0);
class Skill {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Skill.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Skill.prototype, "items", void 0);
class Activity {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Activity.prototype, "organization", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Activity.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Activity.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Activity.prototype, "description", void 0);
class Award {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Award.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Award.prototype, "issuer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Award.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Award.prototype, "description", void 0);
class Certification {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Certification.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Certification.prototype, "issuer", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Certification.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], Certification.prototype, "score", void 0);
class CVAnalysisResultDto {
}
exports.CVAnalysisResultDto = CVAnalysisResultDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PersonalInfo),
    __metadata("design:type", PersonalInfo)
], CVAnalysisResultDto.prototype, "personalInfo", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Experience),
    __metadata("design:type", Array)
], CVAnalysisResultDto.prototype, "experiences", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Education),
    __metadata("design:type", Array)
], CVAnalysisResultDto.prototype, "education", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Skill),
    __metadata("design:type", Array)
], CVAnalysisResultDto.prototype, "skills", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Activity),
    __metadata("design:type", Array)
], CVAnalysisResultDto.prototype, "activities", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Award),
    __metadata("design:type", Array)
], CVAnalysisResultDto.prototype, "awards", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => Certification),
    __metadata("design:type", Array)
], CVAnalysisResultDto.prototype, "certifications", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CVAnalysisResultDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CVAnalysisResultDto.prototype, "rawText", void 0);
//# sourceMappingURL=cv-analysis-result.dto.js.map