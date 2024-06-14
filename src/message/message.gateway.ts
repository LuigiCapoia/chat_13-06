import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['X-API-TOKEN'],
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('MessageGateway');

  constructor(private messageService: MessageService) {}

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: { content: string, username: string }): Promise<void> {
    const { content, username } = payload;
    if (!username) {
      this.logger.log('Mensagem rejeitada: Nome de usuário ausente.');
      return;
    }

    const message = await this.messageService.create(content, username, client.id);
    this.server.emit('msgToClient', message.content, message.username, message.clientId);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const messages = await this.messageService.findAll();
    messages.forEach(msg => {
      client.emit('msgToClient', msg.content, msg.username, msg.clientId);
    });
    const welcomeMessage = 'Bem-vindo ao chat!';
    client.emit('msgToClient', welcomeMessage, 'Servidor', 'Servidor');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
