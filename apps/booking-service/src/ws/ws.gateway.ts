import { WebSocketGateway, WebSocketServer, OnGatewayInit } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  afterInit() {
    // eslint-disable-next-line no-console
    console.log('WebSocket gateway initialized');
  }

  emit(event: string, payload: any) {
    this.server.emit(event, payload);
  }
}
