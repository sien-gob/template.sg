import { Inject, Injectable } from '@nestjs/common';
import { ISaveSettingRepository } from '../../../domain/ports/repositories';
import { CreateSettingDtoToCreateSettingEntityMapper } from '../../../domain/mappers';
import { CreateSettingDto } from '../../../domain/dtos';

@Injectable()
export class SaveSettingService {
  constructor(
    @Inject('ISaveSettingRepository')
    private readonly saveSetting: ISaveSettingRepository,
  ) {}

  async run<T>(input: CreateSettingDto<T>) {
    const data = await CreateSettingDtoToCreateSettingEntityMapper.map(input);
    await this.saveSetting.save(data);
    return {
      message: 'Se guardaron los ajustes correctamente',
    };
  }
}
