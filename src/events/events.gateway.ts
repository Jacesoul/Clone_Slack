import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onlineMap } from './onlineMap';

// onlineMap을 여기에 선언을 해도 되지만 nest에서는 기본적으로 하나의 파일에 하나의 export가 있는게 좋기 때문에 구조적으로 만들기 위해서 분리를 한다.
// export const onlineMap = {};

@WebSocketGateway({ namespace: /\/ws-.+/ }) // 사용자들이 어떤 워크스페이스를 만들지 모르기 때문에 정규표현식으로 사용자들이 만드는 워크스페이스 그 족족 모든걸 처리하기위해 정규표현식으로 한다. 워크스페이스 이름은 socket.nsp.name으로 접근 가능하다.
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handlelogin(
    // 의존성 주입
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const newNamespace = socket.nsp;
    console.log('login', newNamespace);
    onlineMap[socket.nsp.name][socket.id] = data.id;
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
    data.channels.forEach((channel) => {
      console.log('join', socket.nsp.name, channel);
      socket.join(`${socket.nsp.name}-${channel}`);
    });
  }

  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  //onlineMap은 워크스페이스 참가자 목록을 실시간으로 담고 있는 객체입니다.
  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    if (!onlineMap[socket.nsp.name]) {
      onlineMap[socket.nsp.name] = {};
    }
    // broadcast to all clients in the given sub-namespace
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
    const newNamespace = socket.nsp;
    delete onlineMap[socket.nsp.name][socket.id];
    newNamespace.emit('onlineList', Object.values(onlineMap[socket.nsp.name]));
  }
}

// namespace(서버, 전체대기실 같은 느낌) -> room
// workspace -> channel / dm
