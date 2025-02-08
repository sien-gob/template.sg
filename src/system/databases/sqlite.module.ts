import { Module, Global } from '@nestjs/common';
import { Database } from './database';

@Global()
@Module({
  providers: [Database],
  exports: [Database],
})
export class SqliteModule {}
