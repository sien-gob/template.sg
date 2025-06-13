import { Module } from '@nestjs/common';
import { SyslogFindByFilterService, SyslogRemoveByFilterService, SyslogSaveService } from './application/services';
import { SqliteModule } from 'src/system/databases/sqlite.module';
import { SyslogFindByFilterSqliteRepository, SyslogRemoveByFilterSqliteRepository, SyslogSaveSqliteRepository } from './infrastructure/adapters';
import { SyslogFindByFilterController, SyslogRemoveByFilterController } from './infrastructure/controllers';

@Module({
  imports: [SqliteModule],
  controllers: [SyslogFindByFilterController, SyslogRemoveByFilterController],
  providers: [
    { provide: 'ISyslogSaveRepository', useClass: SyslogSaveSqliteRepository },
    { provide: 'ISyslogFindByFilterRepository', useClass: SyslogFindByFilterSqliteRepository },
    { provide: 'ISyslogRemoveByFilterRepository', useClass: SyslogRemoveByFilterSqliteRepository },
    SyslogFindByFilterService,
    SyslogRemoveByFilterService,
    SyslogSaveService,
  ],
  exports: [SyslogFindByFilterService, SyslogRemoveByFilterService, SyslogSaveService],
})
export class SyslogModule {}
