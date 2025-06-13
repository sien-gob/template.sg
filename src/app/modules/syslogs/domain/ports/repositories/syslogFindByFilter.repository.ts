import { FilterCondition } from 'src/app/modules/shared/common';
import { SyslogEntity } from '../../entities';

export interface ISyslogFindByFilterRepository {
  find(filter: FilterCondition | null | undefined): Promise<SyslogEntity[]>;
}
