import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ErrorResponseFilter } from './app/exceptions';
import { envs } from './system/configs/environment.config';
import { json, urlencoded } from 'express';
import { CuentaEntity } from './modules/example/cuentas/domain/entities';

export const cuentaModel: CuentaEntity[] = [];

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const lg = new Logger('template.sg');
  const prefix = 'template';
  const port = envs.system.port;

  app.enableCors();
  app.setGlobalPrefix(prefix);
  app.useStaticAssets(join(__dirname, 'public'), {
    prefix: '/public/',
  });
  app.useGlobalFilters(new ErrorResponseFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(json({ limit: '500mb' })); // Límite para JSON
  app.use(urlencoded({ limit: '500mb', extended: true })); // Límite para datos codificados en URL

  await app.listen(port, () => {
    lg.log('🖥️ Server');
    lg.log(`🚀Server ready at http://localhost:${port}/${prefix}`);
    lg.log(`🚀Server ready at http://localhost:${port}/gql`);
    lg.log(`🚀Panel ready at http://localhost:${port}/settings`);

    lg.log(`🚀 Port ws gateway at ${envs.gateway.port}`);
    lg.log(`🚀 Server ws socket gateway at ${envs.endpoints.core.socketGateway}`);
  });
}
bootstrap();
