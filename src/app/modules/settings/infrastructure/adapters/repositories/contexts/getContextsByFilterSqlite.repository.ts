import { Database } from 'src/system/databases';
import { IGetContextsByFilterRepository } from 'src/app/modules/settings/domain/ports/repositories';
import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { Injectable } from '@nestjs/common';
import { ContextModel } from 'src/app/modules/settings/domain/models';

@Injectable()
export class GetContextsByFilterSqliteRepository implements IGetContextsByFilterRepository {
  constructor(private readonly db: Database) {}

  async find(filter: FilterCondition | null | undefined): Promise<ContextModel[]> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);
    const query = `SELECT * FROM contexts ${whereClause}`;
    const rs = await this.db.query(query, params);

    const items = rs.map((row) => {
      return {
        id: row.id,
        name: row.name,
        description: row.description,
      } as ContextModel;
    });

    return items;
  }
}
