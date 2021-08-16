import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {
    super();
  }
  // serializeUser는 User객체가 무거우니까 user의 id만 뽑아서 세션에 저장을 해놓는다.
  serializeUser(user: Users, done: CallableFunction) {
    console.log(user);
    done(null, user.id);
  }
  // deserializeUser는 req.user가 필요할때마다 세션에 저장되어 있는 id뽑아서 다시 User객체로 복원을 해서 req.user에 넣어준다.(복원하는 과정)
  async deserializeUser(userId: string, done: CallableFunction) {
    return await this.usersRepository
      .findOneOrFail(
        // findOne이라고만 해도 되지만 혹시나 error가 생길수 있으니 orFail로 한다. DB에 쿼리 날릴때에는 DB에 연결이 끊어져 있을때 error가 뜨는데 항상 비동기는 Error 대비를 해야한다.
        {
          id: +userId,
        },
        {
          select: ['id', 'email', 'nickname'],
          relations: ['Workspaces'],
        },
      )
      .then((user) => {
        console.log('user', user);
        done(null, user); // req.user
      })
      .catch((error) => done(error));
  }
}
