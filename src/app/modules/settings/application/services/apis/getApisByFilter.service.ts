import { Inject, Injectable } from '@nestjs/common';
import { IGetApisByFilterRepository } from '../../../domain/ports/repositories';
import { ApiEntityToApiDtoMapper } from '../../../domain/mappers';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class GetApisByFilterService {
  constructor(
    @Inject('IGetApisByFilterRepository')
    private readonly getApis: IGetApisByFilterRepository,
  ) {}

  async run(filter: FilterCondition | null | undefined) {
    const result = await this.getApis.find(filter);
    return await ApiEntityToApiDtoMapper.maps(result);
  }
}
