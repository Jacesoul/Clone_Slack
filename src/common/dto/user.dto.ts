import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';

// dto가 런타임에도 존재하는 class이기 때문에 validation라이브러리를 붙여서 body를 받으면서 같이할수 있다.
// class 이기 때문에 extends로 상속할수 있다.
export class UserDto extends JoinRequestDto {
  @ApiProperty({
    required: true,
    example: 1,
    description: '아이디',
  })
  id: number;
}

//   @ApiProperty({
//     required: true,
//     example: 'jace@gmail.com',
//     description: '이메일',
//   })
//   id: number;
// }
