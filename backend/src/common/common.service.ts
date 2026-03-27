import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
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
}
