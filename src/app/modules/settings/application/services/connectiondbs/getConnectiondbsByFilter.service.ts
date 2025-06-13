import { Inject, Injectable } from '@nestjs/common';
import { IGetConnectiondbsByFilterRepository } from '../../../domain/ports/repositories';
import { ConnectiondbEntityToConnectiondbDtoMapper } from '../../../domain/mappers';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class GetConnectiondbsByFilterService {
  constructor(
    @Inject('IGetConnectiondbsByFilterRepository')
    private readonly getConnectiondbs: IGetConnectiondbsByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    const result = await this.getConnectiondbs.find(filter);
    return await ConnectiondbEntityToConnectiondbDtoMapper.maps(result);
  }
}
