import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestIdInterceptor } from './interceptors/RequestId.interceptor';
import { RequestContextService } from './services';

@Global()
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestIdInterceptor,
    },
    RequestContextService,
  ],
  exports: [RequestContextService],
})
export class RequestModule {}
