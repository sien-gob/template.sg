import { Module, OnModuleInit } from '@nestjs/common';
import { AppGraphqlModule } from './modules/graphql/appGraphql.module';
import { APP_GUARD, ModuleRef } from '@nestjs/core';
import { Database } from 'src/system/databases';
import { ApiResponse } from 'src/system/response';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './modules/databases/database.module';
import { SettingModule } from './modules/settings/setting.module';
import { CuentaModule } from 'src/modules/example/cuentas/cuenta.module';
import { RequestModule } from './modules/requests/request.module';
import { UpdaterModule } from './modules/updaters/update.module';

@Module({
  imports: [
    AppGraphqlModule,
    DatabaseModule,
    SettingModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    RequestModule,
    CuentaModule,
    UpdaterModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit() {
    const db = new Database();
    await db.initializeDatabase();

    ApiResponse.setModuleRef(this.moduleRef);
  }
}
