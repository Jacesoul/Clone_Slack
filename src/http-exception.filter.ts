import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

// 즉 HttpException에서 에러가 났을때 아랫부분이 실행이 된다.
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // implements를 하게 되면 아래의 catch가 들어갈수밖에 없다.
  // HttpException의 정보가 아래의 exception에 들어가게 된다.
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as  // | string
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] }; // class-validator

    if (typeof err !== 'string' && err.statusCode === 400) {
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      data: err.message,
    });

    // console.log(status, err);
    // response.status(status).json({ msg: err });
  }
}
