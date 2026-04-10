import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { SettingService } from "./setting.service";
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ChangePasswordDto } from "../dto/change-pass.dto";

@Controller('settings')
export class SettingController {
    constructor(private settingService: SettingService) { }

    @UseGuards(JwtAuthGuard)
    // @Post('change-password')
    // changePassword(@Req() req, @Body() changePasswordDto: ChangePasswordDto) {
    //     const accountID = req.account.accountID;
    //     return this.settingService.changePassword(accountID, changePasswordDto);

    // }

    @Post('change-password')
    changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
        console.log('REQ USER:', req.user);
        // console.log('REQ ACCOUNT ID:', req.account.accountID);
        return this.settingService.changePassword(req.user.sub, dto);
    }
}
