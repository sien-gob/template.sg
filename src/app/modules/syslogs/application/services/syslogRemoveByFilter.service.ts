import { Inject, Injectable } from '@nestjs/common';
import { ISyslogRemoveByFilterRepository } from '../../domain/ports';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class SyslogRemoveByFilterService {
  constructor(
    @Inject('ISyslogRemoveByFilterRepository')
    private readonly deleService: ISyslogRemoveByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    await this.deleService.remove(filter);

    return 'Procesado ...';
  }
}
