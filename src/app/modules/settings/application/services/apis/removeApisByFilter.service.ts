import { Inject, Injectable } from '@nestjs/common';
import { IRemoveApisByFilterRepository } from '../../../domain/ports/repositories';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class RemoveApisByFilterService {
  constructor(
    @Inject('IRemoveApisByFilterRepository')
    private readonly removeApis: IRemoveApisByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    await this.removeApis.remove(filter);
    return {
      message: 'Se removieron las apis seleccionada',
    };
  }
}
