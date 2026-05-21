import { Server } from 'socket.io';
export declare class JobsGateway {
    server: Server;
    private readonly logger;
    broadcastNewJobs(count: number): void;
}
