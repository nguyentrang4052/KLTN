import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAlertDto {
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Từ khóa không được để trống.' })
  @MinLength(2, { message: 'Từ khóa phải có ít nhất 2 ký tự.' })
  @MaxLength(100, { message: 'Từ khóa không được vượt quá 100 ký tự.' })
  keyword: string;
}

export class RemoveAlertDto {
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @IsNotEmpty({ message: 'Email không được để trống.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Từ khóa không được để trống.' })
  keyword: string;
}
