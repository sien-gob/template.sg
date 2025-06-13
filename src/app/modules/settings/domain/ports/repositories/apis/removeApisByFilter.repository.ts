import { FilterCondition } from 'src/app/modules/shared/common';

export interface IRemoveApisByFilterRepository {
  remove(filter: FilterCondition | null | undefined): Promise<void>;
}
