import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
// implements를 사용하면 강제사항이 생긴다.
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    // request.get은 header에서 가져온다.
    const userAgent = request.get('user-agent') || '';

    //이 미들웨어 자체는 라우터보다 더 먼저 실행이 된다. 위쪽의 request에 대한 부분을 기록하고 나서 라우터가 끝나면(finish) on 비동기로 빠져있게 된다.
    // 순서는 윗부분의 reqest -> next() -> response.on
    // morgan 자체가 로깅하는것을 라우팅 끝나고 로깅을 해준다.
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      // private logger = new Logger('HTTP'); 이 코드에서 'HTTP'라는 context가 없다면 그냥 Logger.log로 표현하면 된다. nest에서는 console.log보다 Logger.log를 더 많이 사용한다.
      // context는 나중에 백엔드 작업을 하다가 너무 많은 console.log가 나오면 추적하기가 어렵다. 그래서 이럴때 디버그라는 패키지를 많이 사용한다.
      // nest에서는 Logger로 context 지정해주면 'HTTP'관련된 요청들은 아래쪽에 설정한대로 보여지게 된다.
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    // 미들웨어 사용할때 항상 next를 써야지만 다음으로 넘어간다.
    next();
  }
}
