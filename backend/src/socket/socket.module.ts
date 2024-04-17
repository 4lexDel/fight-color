// socket.module.ts
import { Module } from '@nestjs/common';
import { SocketGateway } from './socket-gateway/socket-gateway.service';


@Module({
  providers: [SocketGateway],
})
export class SocketModule {}
