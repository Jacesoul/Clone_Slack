import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from '../entities/Users';
import { AuthService } from './auth.service';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    // 만약 jwt를 하게 되면 세션을 쓰지 않고 토큰 기반으로 하게 된다. 그렇게 되면 session : false로 하면 된다.
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Users]),
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
