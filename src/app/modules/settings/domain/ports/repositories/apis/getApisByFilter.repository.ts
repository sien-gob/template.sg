import { FilterCondition } from 'src/app/modules/shared/common';
import { ApiEntity } from '../../../entities';

export interface IGetApisByFilterRepository {
  find(filter: FilterCondition | null | undefined): Promise<ApiEntity[]>;
}
