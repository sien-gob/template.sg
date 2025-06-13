import { IMapper } from 'src/app/modules/mappers/domain/models';
import { SettingEntity } from '../../entities';
import { SettingDto } from '../../dtos';

export class SettingEntityToSettingDtoMapper implements IMapper<SettingEntity, SettingDto> {
  async mapping<T>(input: SettingEntity<T>): Promise<SettingDto<T>> {
    return SettingEntityToSettingDtoMapper.map(input);
  }

  static async map<T>(input: SettingEntity<T>): Promise<SettingDto<T>> {
    return new SettingDto<T>({
      ...input,
    });
  }

  static async maps<T>(inputs: SettingEntity<T>[]): Promise<SettingDto<T>[]> {
    return Promise.all(inputs.map((item) => SettingEntityToSettingDtoMapper.map(item)));
  }
}
