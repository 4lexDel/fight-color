import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    // Envoyer un message de bienvenue au client connecté
    client.emit('welcome', 'Welcome to the server!');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any): void {
    console.log('Received message:', data);

    // Émettre le même message à tous les clients connectés, sauf à l'expéditeur
    // console.log(client);
    
    client.broadcast.emit('message', data);
  }

  @SubscribeMessage('privateMessage')
  handlePrivateMessage(client: Socket, payload: { recipient: string, message: string }) {
    console.log(`Private message from ${client.id} to ${payload.recipient}: ${payload.message}`);

    // Trouver le client destinataire par son ID
    const recipientSocket = this.server.sockets.sockets.get(payload.recipient);
    if (recipientSocket) {
      // Émettre le message privé au destinataire uniquement
      recipientSocket.emit('privateMessage', `Private message from ${client.id}: ${payload.message}`);
    } else {
      // Si le client destinataire n'existe pas, envoyer une erreur au client émetteur
      client.emit('error', 'Recipient not found');
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    console.log(`${client.id} joined room ${room}`);

    // Ajouter le client à la salle spécifiée
    client.join(room);

    // Émettre un message de confirmation au client
    client.emit('joinedRoom', `You joined room ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    console.log(`${client.id} left room ${room}`);

    // Retirer le client de la salle spécifiée
    client.leave(room);

    // Émettre un message de confirmation au client
    client.emit('leftRoom', `You left room ${room}`);
  }
}
