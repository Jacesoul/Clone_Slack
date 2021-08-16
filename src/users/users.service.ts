import {
  Injectable,
  HttpException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository, Connection } from 'typeorm';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    // entity에 쿼리 날리는게 repository이다.
    // module -> controller -> service -> repository -> entity
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private connection: Connection,
  ) {}
  getUser() {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.connection.createQueryRunner();
    queryRunner.connect();
    // 항상 프런트에서도 체크하고 서버에서도 체크해야한다.
    // DTO에서 자동으로 체크가 가능하다.
    if (!email) {
      // throw는 return 기능도 수행한다.
      // throw new HttpException('이메일이 없습니다.', 400); // 400 : bad request
      throw new BadRequestException('이메일이 없습니다.');
    }
    if (!nickname) {
      // throw new HttpException('닉네임이 없습니다. ', 400);
      throw new BadRequestException('닉네임이 없습니다.');
    }
    if (!password) {
      // throw new HttpException('비밀번호가 없습니다. ', 400);
      throw new BadRequestException('비밀번호가 없습니다.');
    }
    // 여기서 this는 constructor의 userRepository를 가져온것
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      // throw new HttpException('이미 존재하는 사용자입니다.', 401); // 401 : unauthorzied
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hasedPassword = await bcrypt.hash(password, 12);
    const returned = await this.userRepository.save({
      email,
      nickname,
      password: hasedPassword,
    });
    await this.workspaceMembersRepository.save({
      UserId: returned.id,
      WorkspaceId: 1,
    });
    await this.channelMembersRepository.save({
      UserId: returned.id,
      ChannelId: 1,
    });
    return true;
  }
}
