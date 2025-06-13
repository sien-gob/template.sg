import { FilterCondition } from 'src/app/modules/shared/common';
import { ConnectiondbEntity } from '../../../entities';

export interface IGetConnectiondbsByFilterRepository {
  find(filter: FilterCondition | null | undefined): Promise<ConnectiondbEntity[]>;
}
