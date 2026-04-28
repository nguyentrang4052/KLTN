import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL, credentials: true },
  namespace: '/notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  private userSockets = new Map<number, Set<string>>();

  constructor(private jwtService: JwtService) { }

  async handleConnection(socket: Socket) {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);

      const accountID: number = payload.sub

      socket.data.userID = accountID;

      if (!this.userSockets.has(accountID)) {
        this.userSockets.set(accountID, new Set());
      }
      this.userSockets.get(accountID)!.add(socket.id);

      this.logger.log(`User ${accountID} connected (socket: ${socket.id})`);
    } catch {
      socket.disconnect();
    }
  }

  handleDisconnect(socket: Socket) {
    const userID = socket.data.userID;
    if (!userID) return;

    const sockets = this.userSockets.get(userID);
    if (sockets) {
      sockets.delete(socket.id);
      if (sockets.size === 0) this.userSockets.delete(userID);
    }

    this.logger.log(`User ${userID} disconnected (socket: ${socket.id})`);
  }
  sendToUser(userID: number, event: string, data: any) {
    const sockets = this.userSockets.get(userID);
    if (!sockets || sockets.size === 0) return;

    for (const socketID of sockets) {
      this.server.to(socketID).emit(event, data);
    }
  }

  @SubscribeMessage('ping')
  handlePing(socket: Socket) {
    socket.emit('pong');
  }
}
