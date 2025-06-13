import { FilterCondition } from 'src/app/modules/shared/common';
import { SettingEntity } from '../../../entities';

export interface IGetSettingsByFilterRepository {
  find<T>(filter: FilterCondition | null | undefined): Promise<SettingEntity<T>[]>;
}
