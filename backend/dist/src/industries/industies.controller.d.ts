import { IndustriesService } from './industries.service';
import { QueryIndustriesDto } from '../dto/industries.dto';
export declare class IndustriesController {
    private readonly industriesService;
    constructor(industriesService: IndustriesService);
    getIndustries(dto: QueryIndustriesDto): Promise<{
        name: string;
        id: number;
    }[]>;
    getIndustriesWithCount(): Promise<{
        id: number;
        name: string;
        jobCount: number;
        trend: string;
    }[]>;
}
