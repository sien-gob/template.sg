import { Module } from '@nestjs/common';
import { SqliteModule } from 'src/system/databases/sqlite.module';
import { GetConnectionsSqliteRepository } from './infrastructure/repositories/sqlite/getConnectionsSqlite.repository';
import { GetConnectionService } from './application/services';

@Module({
  imports: [SqliteModule],
  providers: [
    {
      provide: 'IGetConnections',
      useClass: GetConnectionsSqliteRepository,
    },
    GetConnectionService,
  ],
  exports: [GetConnectionService],
})
export class DatabaseModule {}
