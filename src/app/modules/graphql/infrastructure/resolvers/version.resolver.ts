/* eslint-disable @typescript-eslint/no-unused-vars */
import { Context, Query, Resolver } from '@nestjs/graphql';
import { Version, VersionResponse } from '../../domain/models';
import { ApiResponse } from 'src/system/response';
import { GetVersionService } from '../../application/services';

@Resolver("version")
export class VersionResolver {
  constructor(private readonly getVersionService: GetVersionService) {}

  @Query(() => VersionResponse, { name: 'getVersion', nullable: true })
  async getVersion() {
    const process = async (): Promise<Version[] | null> => {
      const result = await this.getVersionService.run();
      return [result];
    };
    return await ApiResponse.processRequest<Version[] | null>(process);
  }
}
