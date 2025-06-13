import { Module } from '@nestjs/common';
import { SqliteModule } from 'src/system/databases/sqlite.module';
import {
  ApplyContextApiSqliteRepository,
  ApplyContextConnectiondbSqliteRepository,
  GetApisByFilterSqliteRepository,
  GetConnectiondbsByFilterSqliteRepository,
  GetContextsByFilterSqliteRepository,
  GetSettingsByFilterSqliteRepository,
  RemoveApisByFilterSqliteRepository,
  RemoveConnectiondbsByFilterSqliteRepository,
  SaveApiSqliteRepository,
  SaveConnectiondbSqliteRepository,
  SaveSettingSqliteRepository,
} from './infrastructure/adapters/repositories';
import {
  ApplyContextApiController,
  ApplyContextConnectiondbController,
  GetApisByFilterController,
  GetConnectiondbsByFilterController,
  GetContextsByFilterController,
  GetSettingsByFilterController,
  RemoveApisByFilterController,
  RemoveConnectiondbsByFilterController,
  SaveApiController,
  SaveConnectiondbController,
  SaveSettingController,
  UploadExpoQRController,
} from './infrastructure/controllers';
import {
  ApplyContextApiService,
  ApplyContextConnectiondbService,
  GetApisByFilterService,
  GetConnectiondbsByFilterService,
  GetContextsByFilterService,
  GetSettingsByFilterService,
  RemoveApisByFilterService,
  RemoveConnectiondbsByFilterService,
  SaveApiService,
  SaveConnectiondbService,
  SaveSettingService,
} from './application/services';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SyslogModule } from '../syslogs/syslog.module';


@Module({
  imports: [SqliteModule, EventEmitterModule.forRoot(), ScheduleModule.forRoot(), SyslogModule],
  controllers: [
    SaveSettingController,
    GetSettingsByFilterController,
    GetApisByFilterController,
    RemoveApisByFilterController,
    SaveApiController,
    GetConnectiondbsByFilterController,
    RemoveConnectiondbsByFilterController,
    SaveConnectiondbController,
    GetContextsByFilterController,
    ApplyContextConnectiondbController,
    ApplyContextApiController,
    UploadExpoQRController,
  ],
  providers: [
    {
      provide: 'IGetSettingsByFilterRepository',
      useClass: GetSettingsByFilterSqliteRepository,
    },
    {
      provide: 'ISaveSettingRepository',
      useClass: SaveSettingSqliteRepository,
    },

    {
      provide: 'IGetApisByFilterRepository',
      useClass: GetApisByFilterSqliteRepository,
    },
    {
      provide: 'IRemoveApisByFilterRepository',
      useClass: RemoveApisByFilterSqliteRepository,
    },
    {
      provide: 'ISaveApiRepository',
      useClass: SaveApiSqliteRepository,
    },
    {
      provide: 'IGetConnectiondbsByFilterRepository',
      useClass: GetConnectiondbsByFilterSqliteRepository,
    },
    {
      provide: 'IRemoveConnectiondbsByFilterRepository',
      useClass: RemoveConnectiondbsByFilterSqliteRepository,
    },
    {
      provide: 'ISaveConnectiondbRepository',
      useClass: SaveConnectiondbSqliteRepository,
    },
    {
      provide: 'IGetContextsByFilterRepository',
      useClass: GetContextsByFilterSqliteRepository,
    },
    {
      provide: 'IApplyContextConnectiondbRepository',
      useClass: ApplyContextConnectiondbSqliteRepository,
    },
    {
      provide: 'IApplyContextApiRepository',
      useClass: ApplyContextApiSqliteRepository,
    },

    SaveSettingService,
    GetSettingsByFilterService,

    GetApisByFilterService,
    SaveApiService,
    RemoveApisByFilterService,
    GetConnectiondbsByFilterService,
    RemoveConnectiondbsByFilterService,
    SaveConnectiondbService,
    GetContextsByFilterService,
    ApplyContextConnectiondbService,
    ApplyContextApiService,
  ],
  exports: [],
})
export class SettingModule {}
