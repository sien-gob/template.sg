import { FilterCondition } from 'src/app/modules/shared/common';

export interface IRemoveConnectiondbsByFilterRepository {
  remove(filter: FilterCondition | null | undefined): Promise<void>;
}
