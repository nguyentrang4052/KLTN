import { SettingService } from "./setting.service";
import { ChangePasswordDto } from "../dto/change-pass.dto";
export declare class SettingController {
    private settingService;
    constructor(settingService: SettingService);
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
