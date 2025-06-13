import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { ISyslogRemoveByFilterRepository } from '../../../domain/ports';
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';

@Injectable()
export class SyslogRemoveByFilterSqliteRepository implements ISyslogRemoveByFilterRepository {
  constructor(private readonly db: Database) {}

  async remove(filter: FilterCondition | null | undefined): Promise<void> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);  
    const query = `DELETE FROM syslogs ${whereClause}`;
    await this.db.query(query, params);
  }
}
