"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonService = void 0;
const common_1 = require("@nestjs/common");
let CommonService = class CommonService {
    getLocations() {
        return [
            'Hà Nội',
            'TP. Hồ Chí Minh',
            'Hải Phòng',
            'Đà Nẵng',
            'Cần Thơ',
            'Huế',
            'An Giang',
            'Bắc Ninh',
            'Bình Dương',
            'Bình Thuận',
            'Cao Bằng',
            'Cà Mau',
            'Đắk Lắk',
            'Điện Biên',
            'Đồng Nai',
            'Đồng Tháp',
            'Gia Lai',
            'Hà Tĩnh',
            'Hưng Yên',
            'Khánh Hòa',
            'Lai Châu',
            'Lào Cai',
            'Lâm Đồng',
            'Lạng Sơn',
            'Long An',
            'Nghệ An',
            'Ninh Bình',
            'Phú Thọ',
            'Quảng Ngãi',
            'Quảng Ninh',
            'Sơn La',
            'Thanh Hóa',
            'Thái Nguyên',
            'Tuyên Quang',
            'Vĩnh Long',
            'Toàn quốc',
            'Remote',
        ].map((name) => ({
            value: name,
            label: name,
        }));
    }
};
exports.CommonService = CommonService;
exports.CommonService = CommonService = __decorate([
    (0, common_1.Injectable)()
], CommonService);
//# sourceMappingURL=common.service.js.map