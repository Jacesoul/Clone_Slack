import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    // entity에 쿼리 날리는게 repository이다.
    // module -> controller -> service -> repository -> entity
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}
  getUser() {}

  async join(email: string, nickname: string, password: string) {
    // 항상 프런트에서도 체크하고 서버에서도 체크해야한다.
    // DTO에서 자동으로 체크가 가능하다.
    if (!email) {
      // throw는 return 기능도 수행한다.
      throw new Error('이메일이 없습니다.');
    }
    if (!nickname) {
      throw new Error('닉네임이 없습니다. ');
    }
    if (!password) {
      throw new Error('비밀번호가 없습니다. ');
    }
    // 여기서 this는 constructor의 userRepository를 가져온것
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new Error('이미 존재하는 사용자입니다. ');
    }
    const hasedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.save({
      email,
      nickname,
      password: hasedPassword,
    });
  }
}
