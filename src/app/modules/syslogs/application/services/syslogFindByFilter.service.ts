import { Inject, Injectable } from '@nestjs/common';
import { ISyslogFindByFilterRepository } from '../../domain/ports';
import { FilterCondition } from 'src/app/modules/shared/common';
import { SyslogEntityToSyslogDtoMapper } from '../../domain/mappers';

@Injectable()
export class SyslogFindByFilterService {
  constructor(
    @Inject('ISyslogFindByFilterRepository')
    private readonly findService: ISyslogFindByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    const result = await this.findService.find(filter);
    const items = SyslogEntityToSyslogDtoMapper.maps(result);
    return items;
  }
}
