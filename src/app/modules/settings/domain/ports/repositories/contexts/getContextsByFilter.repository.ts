import { FilterCondition } from 'src/app/modules/shared/common';
import { ContextModel } from '../../../models';

export interface IGetContextsByFilterRepository {
  find(filter: FilterCondition | null | undefined): Promise<ContextModel[]>;
}
