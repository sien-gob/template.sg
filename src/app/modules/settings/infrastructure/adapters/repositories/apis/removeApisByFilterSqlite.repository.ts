import { Database } from 'src/system/databases';
import { IRemoveApisByFilterRepository } from 'src/app/modules/settings/domain/ports/repositories';
import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RemoveApisByFilterSqliteRepository implements IRemoveApisByFilterRepository {
  constructor(private readonly db: Database) {}

  async remove(filter: FilterCondition | null | undefined): Promise<void> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);
    const query = `DELETE FROM apis ${whereClause}`;
    await this.db.query(query, params);
  }
}
