import { JobAlertService } from './job-alert.service';
import { CreateAlertDto, RemoveAlertDto } from '../dto/alert-job.dto';
import type { JwtUser } from '../auth/interfaces/jwt-user.interface';
export declare class JobAlertController {
    private readonly jobAlertService;
    constructor(jobAlertService: JobAlertService);
    createAlert(user: JwtUser, dto: CreateAlertDto): Promise<{
        message: string;
    }>;
    removeAlert(user: JwtUser, dto: RemoveAlertDto): Promise<{
        message: string;
    }>;
    getAlerts(user: JwtUser): Promise<{
        createdAt: Date;
        keyword: string;
    }[]>;
}
