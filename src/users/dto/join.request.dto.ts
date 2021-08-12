import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  // DTO 예제생성
  @ApiProperty({
    example: 'jace@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: '지우지우',
    description: '닉네임',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: 'nodejsbook',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}
