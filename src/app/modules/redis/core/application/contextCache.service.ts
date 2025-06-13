import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class ContextCacheService {
  constructor(private redisService: RedisService) {}

  private minutesToTTL(minutes: number): number {
    return minutes * 60;
  }

  async setContext(contextId: string, context: any, cacheMinutes: number = 20): Promise<void> {
    const ttl = this.minutesToTTL(cacheMinutes);
    await this.redisService.set(`context:${contextId}`, context, ttl);
  }

  async getContext(contextId: string): Promise<any> {
    return await this.redisService.get(`context:${contextId}`);
  }

  async removeContext(contextId: string): Promise<void> {
    await this.redisService.del(`context:${contextId}`);
  }
}
