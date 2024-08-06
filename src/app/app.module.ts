import { Module } from '@nestjs/common';
import { AppGraphqlModule } from './modules/graphql/appGraphql.module';

@Module({
  imports: [AppGraphqlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
