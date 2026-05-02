import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEvents } from '@petpooja/shared';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
  }

  // Emit to all connected clients
  emitToAll(event: SocketEvents, data: unknown) {
    this.server.emit(event, data);
  }

  // Emit to a specific room (e.g., outlet-specific)
  emitToRoom(room: string, event: SocketEvents, data: unknown) {
    this.server.to(room).emit(event, data);
  }
}
