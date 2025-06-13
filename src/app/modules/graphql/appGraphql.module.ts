/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { GetVersionService } from './application/services';
import { VersionResolver } from './infrastructure/resolvers';
import GraphQLJSON from 'graphql-type-json';


@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: 'gql',
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/system/schema/graphQL/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError(formattedError, error: any) {
        return { status: 'error', data: null, message: formattedError.message };
      },
      resolvers: { JSON: GraphQLJSON },
      //context: ({ req, res }) => ({ req, res }),
    }),
  ],
  providers: [GetVersionService, VersionResolver],
  exports: [GraphQLModule],
})
export class AppGraphqlModule {}
