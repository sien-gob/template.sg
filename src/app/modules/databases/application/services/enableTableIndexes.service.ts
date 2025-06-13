/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { IEnableTableIndexesRepository } from '../../domain/ports';

@Injectable()
export class EnableTableIndexesService {
  constructor(
    @Inject('IEnableTableIndexesRepository')
    private readonly enableRepository: IEnableTableIndexesRepository,
  ) {}

  async run(tableName: string) {
    await this.enableRepository.enable(tableName);
  }
}
