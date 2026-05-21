import { CommonService } from './common.service';
export declare class CommonController {
    private readonly commonService;
    constructor(commonService: CommonService);
    getLocations(): {
        value: string;
        label: string;
    }[];
}
