import { Module, OnModuleInit } from '@nestjs/common';
import { DisableTableIndexesService, EnableTableIndexesService } from './application/services';
import { DisableTableIndexesPgRepository, EnableTableIndexesPgRepository } from './infrastructure/adapters/repositories';
import { TableIndexService } from './application/services/tableIndex.service';
import { SqliteModule } from 'src/system/databases/sqlite.module';
import { Database } from 'src/system/databases';
import { editEnvironment, envs } from 'src/system/configs';
import { GetApisSupport } from '../settings/infrastructure/supports';
import { initializePool } from './infrastructure/pg/pg.config';

@Module({
  imports: [SqliteModule],
  providers: [
    EnableTableIndexesService,
    DisableTableIndexesService,
    TableIndexService,
    {
      provide: 'IDisableTableIndexesRepository',
      useClass: DisableTableIndexesPgRepository,
    },
    {
      provide: 'IEnableTableIndexesRepository',
      useClass: EnableTableIndexesPgRepository,
    },
  ],
  exports: [EnableTableIndexesService, DisableTableIndexesService, TableIndexService],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly database: Database) {}

  async onModuleInit() {
    // En este orden
    await this.database.initializeDatabase();
    await initializePool();

    const items = await GetApisSupport.getApis({});
    items.forEach((api) => {
      
    });
    
    //editEnvironment({ type: api.metadata.context.id, value: api.url });
    // console.log(
    //   'database.module :: importer : ',
    //   envs.endpoints.sg.importer,
    //   'socketGateway : ',
    //   envs.endpoints.sg.socketGateway,
    //   'access : ',
    //   envs.endpoints.sg.access,
    // );
  }
}
