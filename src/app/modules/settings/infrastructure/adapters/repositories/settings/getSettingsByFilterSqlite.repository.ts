import { Database } from 'src/system/databases';
import { SettingEntity } from '../../../../domain/entities';
import { IGetSettingsByFilterRepository } from '../../../../domain/ports/repositories';
import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GetSettingsByFilterSqliteRepository implements IGetSettingsByFilterRepository {
  constructor(private readonly db: Database) {}

  /**
   *
   * @param filter : ej. { filter : { id: 'config' } };
   * @returns Promise<SettingEntity<T>[]> ;
   */
  async find<T>(filter: FilterCondition | null | undefined): Promise<SettingEntity<T>[]> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);
    const query = `SELECT * FROM settings ${whereClause}`;
  
    const rs = await this.db.query(query, params);
    
    const items = rs.map((row) => {
      const data = JSON.parse(row.data) as T;

      return new SettingEntity({
        id: row.id,
        data: data,
      });
    });

    return items;
  }
}
