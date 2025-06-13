import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger, OnModuleDestroy } from '@nestjs/common';
import { Observable } from 'rxjs';
import Redis from 'ioredis';
import { envs } from 'src/system/configs';
import { RedisException } from '../../domain/exceptions';

@Injectable()
export class RedisCheckInterceptor implements NestInterceptor, OnModuleDestroy {
  private redis: Redis;

  protected readonly logger = new Logger('Redis');

  constructor() {
    this.redis = new Redis({
      host: envs.redis.host,
      port: envs.redis.port,
    });
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    try {
      await this.redis.ping();
      //this.logger.log('Conexión a Redis establecida correctamente');
      return next.handle();
    } catch (error) {
      throw new RedisException({ message: 'Redis no está disponible' });
    }
  }

  onModuleDestroy() {
    this.redis.disconnect();
    this.logger.log('Conexión a Redis cerrada');
  }
}
