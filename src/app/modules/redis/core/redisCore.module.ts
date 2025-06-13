import { Global, Module } from '@nestjs/common';
import { RedisService } from './application';
import { ContextCacheService } from './application/contextCache.service';

@Global()
@Module({
  providers: [RedisService, ContextCacheService],
  exports: [RedisService, ContextCacheService],
})
export class RedisCoreModule {}
