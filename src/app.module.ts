import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { autoLoadEntities } from 'ormconfig';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import * as ormconfig from '../ormconfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      //모든 모듈에서 process.env사용가능
      isGlobal: true,
    }),
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([Users]),
  ],
  controllers: [AppController],
  providers: [AppService],
  // 이 모듈에서 쓰고 있는건데 이걸 다른 모듈에서도 쓰게하고 싶다면 exports안에 넣어서 사용이 가능하다.
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    // morgan보다는 기능이 적지만 nest에서도 미들웨어 Logger로 사용할수 있다는것을 보여주었다.
    // 미들웨어들은 consumer에 연결한다.
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
