import { FilterCondition } from 'src/app/modules/shared/common';

export interface ISyslogRemoveByFilterRepository {
  remove(filter: FilterCondition | null | undefined): Promise<void>;
}
