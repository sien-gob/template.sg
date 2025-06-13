import { CreateSettingEntity } from '../../../entities';

export interface ISaveSettingRepository {
  save<T>(input: CreateSettingEntity<T>): Promise<void>;
}
