import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ProgressData } from '../../domain/models';
import { envs } from 'src/system/configs';

@WebSocketGateway(5000, {
  cors: { origin: '*', credentials: true },
  namespace: '/ws/updatedb/notification',
})
export class UpdateDbGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private usersMap: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.usersMap.set(userId, client.id);
      console.log('updateDb.gateway :: ', `User ${userId} connected with socket id ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.usersMap.entries()) {
      if (socketId === client.id) {
        this.usersMap.delete(userId);
        console.log('updateDb.gateway :: ', `User ${userId} disconnected`);
        break;
      }
    }
  }

  private notify(event: 'progress' | 'completed' | 'failed', userId: string, progressData: ProgressData) {
    const socketId = this.usersMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, progressData);
    }
  }

  notifyProgress(userId: string, progressData: ProgressData) {
     this.notify("progress", userId, progressData)
  }

  notifyCompleted(userId: string, progressData: ProgressData) {
     this.notify("completed", userId, progressData)
  }

  notifyFailed(userId: string, progressData: ProgressData) {
     this.notify("failed", userId, progressData)
  }
}

