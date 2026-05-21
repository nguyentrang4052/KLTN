declare const OptionalJwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class OptionalJwtGuard extends OptionalJwtGuard_base {
    handleRequest<TUser = any>(_err: any, user: TUser): TUser;
}
export {};
