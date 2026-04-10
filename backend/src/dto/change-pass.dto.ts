import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @IsOptional({ message: 'Vui lòng nhập mật khẩu cũ' })
    oldPassword: string;

    @IsNotEmpty({ message: ' Vui lòng nhập mật khẩu mới' })
    @MinLength(8, { message: ' Mật khẩu mới phải có ít nhất 8 ký tự' })
    newPassword: string;

    @IsNotEmpty({ message: ' Vui lòng xác nhận mật khẩu mới' })
    confirmPassword: string;
}