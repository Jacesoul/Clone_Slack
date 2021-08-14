import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 전 부분
    // return next.handle().pipe(map((data) => ({ data, code: 'SUCCESS' })));
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
    // 위에서 data는 controller에서 return해주는 데이터다.
    // data가 undefined라면 null로 바꿔주고 그렇지 않으면 그냥 data로 리턴

    // return next.handle().pip(catchError)
  }
}

// data === user
// { data : user, code : 'SUCCESS }

// new Error('에러났어요');
// {name : error.name, message : error.message}
