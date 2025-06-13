import { IMapper } from 'src/app/modules/mappers/domain/models';
import { SettingDto } from '../../dtos';
import { CreateSettingDto } from '../../dtos/settings/createSetting.dto';
import { CreateSettingEntity } from '../../entities/Settings/createSetting.entity';

export class CreateSettingDtoToCreateSettingEntityMapper implements IMapper<CreateSettingDto, CreateSettingEntity> {
  async mapping<T>(input: CreateSettingDto<T>): Promise<CreateSettingEntity<T>> {
    return CreateSettingDtoToCreateSettingEntityMapper.map(input);
  }

  static async map<T>(input: CreateSettingDto<T>): Promise<CreateSettingEntity<T>> {
    return new SettingDto<T>({
      ...input,
    });
  }

  static async maps<T>(inputs: CreateSettingDto<T>[]): Promise<CreateSettingEntity<T>[]> {
    return Promise.all(inputs.map((item) => CreateSettingDtoToCreateSettingEntityMapper.map(item)));
  }
}
