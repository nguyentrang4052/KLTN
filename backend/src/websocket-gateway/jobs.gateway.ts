import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/jobs',
})
export class JobsGateway {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(JobsGateway.name);

  broadcastNewJobs(count: number) {
    this.server.emit('new_jobs', { count, timestamp: Date.now() });
    this.logger.log(`Broadcast new_jobs: ${count} jobs`);
  }
}
