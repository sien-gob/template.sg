import { Inject, Injectable } from '@nestjs/common';
import { IRemoveConnectiondbsByFilterRepository } from '../../../domain/ports/repositories';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class RemoveConnectiondbsByFilterService {
  constructor(
    @Inject('IRemoveConnectiondbsByFilterRepository')
    private readonly removeConnectiondbs: IRemoveConnectiondbsByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    await this.removeConnectiondbs.remove(filter);
    return {
      message: 'Se removieron las conexión seleccionada',
    };
  }
}
