import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { TokenBlacklistService } from '../auth/token-blacklist.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private blacklistService;
    constructor(blacklistService: TokenBlacklistService);
    validate(req: Request, payload: {
        sub: number;
        email: string;
        role: string;
    }): {
        sub: number;
        email: string;
        role: string;
    };
}
export {};
