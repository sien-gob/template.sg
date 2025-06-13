/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { envs } from 'src/system/configs';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: envs.redis.host,
        port: envs.redis.port,
        // retryStrategy: (times) => {
        //   const maxRetries = 5;
        //   if (times > maxRetries) {
        //     console.error(`Redis reconnection failed after ${maxRetries} attempts.`);
        //     return null;
        //   }
        //   console.warn(`Redis reconnection attempt #${times}`);
        //   return 2000;
        // },
      },
      settings: {
        lockDuration: 30000,
        stalledInterval: 30000,
        maxStalledCount: 3,
        retryProcessDelay: 5000,
        drainDelay: 5,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
        //attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    }),
  ],
  exports: [BullModule],
})
export class BullConfigModule {}
