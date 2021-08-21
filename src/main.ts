import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, ApiCookieAuth } from '@nestjs/swagger';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 이렇게 설정하면 @Param('id', ParseIntPipe) id: number 여기에서 처럼 ParseIntPipe사용하지 않아도 자동으로 number로 바꿔준다.
    }),
  );
  // 앞으로 모든 controller에서 발생하는 httpException을 여기서 걸러줄수 있다.
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  // 이렇게 useStaticAssets에서 에러가 나는경우는 express에서는 있지만 fastify에서는 없고 또는 그 반대방향으로 없을수가 있다.nest는 내부적으로 express 또는 fastify를 선택할수 있다. 이럴때는 위에서 app을 만들때 제너릭으로 명시적으로 NestExpressApplication을 선언해주는게 좋다. express가 익숙하다면 처음부터 NestExpressApplication을 넣어주는게 좋다.
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0')
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        httpOnly: true,
      },
    }),
  );
  app.use(passport.initialize());
  // jwt를 써서 세션이 필요없는 경우는 아래의 세션미들웨어는 삭제해도 된다.
  app.use(passport.session());

  await app.listen(port);
  console.log(`Listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
