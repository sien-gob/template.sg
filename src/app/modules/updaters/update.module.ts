import { Module } from '@nestjs/common';
import {
  CreateFileVersionPgAdapter,
  ExecuteScriptPgAdapter,
  GetCurrentVersionAppSqlliteAdapter,
  GetCurrentVersionDbPgAdapter,
  SaveCurrentVersionAppSqlliteAdapter,
  SaveCurrentVersionDbPgAdapter,
  VersionExistenceCheckerPgAdapter,
} from './infrastructure/adapters/repositories';
import { FileUtil } from './infrastructure/utils';
import { UpdateDbGateway } from './infrastructure/gateways';
import { BullModule } from '@nestjs/bullmq';
import { GetCurrentVersionService, UpdateDbService } from './application/services';
import { GetVersionController, UpdateDbController } from './infrastructure/controllers';
import { envs } from 'src/system/configs';
import { UpdateDBProcessorWorker } from './infrastructure/processors';
import { SqliteModule } from 'src/system/databases/sqlite.module';
import { VersionValidationGuard } from './infrastructure/guards/versionValidation.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: envs.redis.host,
        port: envs.redis.port,
      },
      defaultJobOptions: {
        attempts: 3,
        removeOnComplete: true,
        removeOnFail: true,
        backoff: 2000,
      },
    }),
    BullModule.registerQueue({ name: 'updatedb' }),
    SqliteModule,
  ],
  controllers: [UpdateDbController, GetVersionController],
  providers: [
    {
      provide: 'ICreateFileVersionRepository',
      useClass: CreateFileVersionPgAdapter,
    },
    {
      provide: 'IExecuteScriptRepository',
      useClass: ExecuteScriptPgAdapter,
    },
    {
      provide: 'ISaveCurrentVersionDbRepository',
      useClass: SaveCurrentVersionDbPgAdapter,
    },
    {
      provide: 'IVersionExistenceCheckerRepository',
      useClass: VersionExistenceCheckerPgAdapter,
    },
    {
      provide: 'ISaveCurrentVersionAppRepository',
      useClass: SaveCurrentVersionAppSqlliteAdapter,
    },
    {
      provide: 'IGetCurrentVersionAppRepository',
      useClass: GetCurrentVersionAppSqlliteAdapter,
    },
    {
      provide: 'IGetCurrentVersionDbRepository',
      useClass: GetCurrentVersionDbPgAdapter,
    },
    {
      provide: APP_GUARD,
      useClass: VersionValidationGuard,
    },
    FileUtil,
    UpdateDbGateway,
    UpdateDbService,
    UpdateDBProcessorWorker,
    GetCurrentVersionService,
    VersionValidationGuard,
    {
      provide: APP_GUARD,
      useClass: VersionValidationGuard, // ✅ Configurar como guard global aquí
    },
  ],
  exports: [GetCurrentVersionService, VersionValidationGuard],
})
export class UpdaterModule {}
