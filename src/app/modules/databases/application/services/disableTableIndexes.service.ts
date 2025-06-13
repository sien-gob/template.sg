/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { IDisableTableIndexesRepository } from '../../domain/ports';

@Injectable()
export class DisableTableIndexesService {
  constructor(
    @Inject('IDisableTableIndexesRepository')
    private readonly disableRepository: IDisableTableIndexesRepository,
  ) {}

  async run(tableName: string) {
    await this.disableRepository.disable(tableName);
  }
}
