import { Module, OnModuleInit } from '@nestjs/common';
import { AppGraphqlModule } from './modules/graphql/appGraphql.module';
import { SyslogModule } from './modules/syslogs/syslog.module';
import { MessengerModule } from 'src/modules/messenger/messenger.module';
import { ModuleRef } from '@nestjs/core';
import { Database } from 'src/system/databases';
import { ApiResponse } from 'src/system/response';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './modules/databases/database.module';

@Module({
  imports: [
    AppGraphqlModule,
    DatabaseModule,
    SyslogModule /* Debe de solo en los Modulos donde se requiera */,
    MessengerModule /* Debe de solo en los Modulos donde se requiera */,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit() {
    const db = new Database();
    await db.initializeDatabase();

    ApiResponse.setModuleRef(this.moduleRef);
  }
}
