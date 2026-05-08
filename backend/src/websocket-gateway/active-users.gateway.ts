import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/notifications',
})
export class ActiveUsersGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ActiveUsersGateway.name);
  private userSockets = new Map<number, Set<string>>();

  constructor(private jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    this.logger.log(`[ActiveUsersGateway] Socket connected: ${socket.id}`);
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

          this.logger.log(`[ActiveUsersGateway] Token: ${token ? 'có' : 'không có'}`); 

          if (!token) { socket.disconnect(); return; }

      const payload = this.jwtService.verify(token);
      const accountID: number = payload.sub;

            this.logger.log(`[ActiveUsersGateway] accountID: ${accountID}`);

            socket.data.accountID = accountID;
            if (!this.userSockets.has(accountID)) {
                this.userSockets.set(accountID, new Set());
            }
            this.userSockets.get(accountID)!.add(socket.id);
            this.logger.log(`[ActiveUsersGateway] User ${accountID} saved, total active: ${this.userSockets.size}`); // ← thêm
        } catch (err) {
            this.logger.error(`[ActiveUsersGateway] Error: ${err.message}`);
            socket.disconnect();
        }
    }

    handleDisconnect(socket: Socket) {
        const accountID = socket.data.accountID;
        if (!accountID) return;
        const sockets = this.userSockets.get(accountID);
        if (sockets) {
            sockets.delete(socket.id);
            if (sockets.size === 0) this.userSockets.delete(accountID);
        }
    }

    getActiveAccountIDs(): Set<number> {
        return new Set(this.userSockets.keys());
    }
}
