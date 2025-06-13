import { Inject, Injectable } from '@nestjs/common';
import { CurrentVersion, IGetCurrentVersionRepository } from '../../domain/ports/repositories';

export type ResponseVersions = {
  db: CurrentVersion;
  app: CurrentVersion;
};

@Injectable()
export class GetCurrentVersionService {
  constructor(
    @Inject('IGetCurrentVersionDbRepository')
    private readonly vsDb: IGetCurrentVersionRepository,

    @Inject('IGetCurrentVersionAppRepository')
    private readonly vsApp: IGetCurrentVersionRepository,
  ) {}

  async run(): Promise<ResponseVersions> {
    const dbs = await this.vsDb.getVersion();
    const apps = await this.vsApp.getVersion();

    return {
      db: dbs[0],
      app: apps[0],
    };
  }
}
