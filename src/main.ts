import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './system/configs';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ErrorResponseFilter } from './app/exceptions';

async function bootstrap() { 
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const lg = new Logger('template.sg');
  const prefix = 'prefix';
  const port = envs.system.port;

  app.enableCors();
  app.setGlobalPrefix(prefix);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useGlobalFilters(new ErrorResponseFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  await app.listen(port, () => {
    lg.log('🖥️ Server');
    lg.log(`🚀Server ready at http://localhost:${port}/${prefix}`);
    lg.log(`🚀Server ready at http://localhost:${port}/gql`);
  });
}
bootstrap();
