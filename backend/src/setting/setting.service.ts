import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';


@Injectable()
export class SettingService {
    constructor(private prisma: PrismaService) { }

    async changePassword(accountID: number, dto) {

        const { oldPassword, newPassword, confirmPassword } = dto;

        if (newPassword !== confirmPassword) {
            throw new BadRequestException('Mật khẩu và xác nhận mật khẩu không khớp');
        }

        const account = await this.prisma.account.findUnique({
            where: { accountID},
            select: { password: true, provider: true },
        });

        if (!account) {
            throw new BadRequestException('Tài khoản không tồn tại');
        }

        // 🔥 CASE 1: tài khoản Google (chưa có password)
        if (account.provider === 'google' && !account.password) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this.prisma.account.update({
                where: { accountID },
                data: { password: hashedPassword },
            });

            return {
                message: 'Đã thiết lập mật khẩu thành công',
            };
        }

        // 🔥 CASE 2: tài khoản thường → cần oldPassword
        if (account.provider !== 'google' || (account.provider === 'google' && account.password)) {
            // account thường → bắt buộc oldPassword
            if (!oldPassword) {
                throw new BadRequestException('Vui lòng nhập mật khẩu cũ');
            }

            const isMatch = await bcrypt.compare(oldPassword, account.password);

            if (!isMatch) {
                throw new UnauthorizedException('Mật khẩu cũ không đúng');
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.account.update({
            where: { accountID },
            data: { password: hashedPassword },
        });

        return {
            message: 'Đổi mật khẩu thành công',
        };
    }
}