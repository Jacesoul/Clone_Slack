import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // 스웨거 api문서에서 보여주는 부분
  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }
  //리턴을 보냈을때 {data : user, code : 'SUCCESS'} 이렇게 알아서 해줬으면 좋겠다라고 생각한다면 interceptor를 사용하자
  // return user;로 끝나게 되면 nest가 알아서 res.json(user)로 보내준다. 여기서 인터셉터가 그 중간에서 데이터를 가공해줄수 있다.
  // return user; -> 인터셉터 데이터 가공 {data : user, code : 'SUCCESS'} -> 마지막 nest가 res.json({data : user, code : 'SUCCESS'}) 리턴
  // 중간에 에러가 난 경우에는 exception filter를 통해 에러를 한번더 변형할 수 있는 기회를 준다.

  @ApiOperation({ summary: '회원가입' })
  @Post()
  join(@Body() body: JoinRequestDto) {
    this.usersService.join(body.email, body.nickname, body.password);
  }

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  //왠만하면 res와 req를 안쓰는게 좋지만 logout같은 경우에는 어쩔수가 없다.
  // 여기서 req,res는 express에 결합이 된다.
  // 만약 추후 express또는 fastify로 넘어갈때 다른부분은 그냥 넘어갈수 있는데 이렇게 express와 결합되어 있는부분은 수정을 해줘야한다.
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
