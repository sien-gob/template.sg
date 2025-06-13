import { Inject, Injectable } from '@nestjs/common';
import { IGetSettingsByFilterRepository } from '../../../domain/ports/repositories';
import { SettingEntityToSettingDtoMapper } from '../../../domain/mappers';
import { FilterCondition } from 'src/app/modules/shared/common';

@Injectable()
export class GetSettingsByFilterService {
  constructor(
    @Inject('IGetSettingsByFilterRepository')
    private readonly getSetting: IGetSettingsByFilterRepository,
  ) {}

  async run<T>(filter: FilterCondition | null | undefined) {
    const result = await this.getSetting.find<T>(filter);
    return await SettingEntityToSettingDtoMapper.maps(result);
  }
}
