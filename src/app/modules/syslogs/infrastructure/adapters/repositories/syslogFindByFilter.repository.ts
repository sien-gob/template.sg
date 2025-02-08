import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { SyslogEntity } from '../../../domain/entities';
import { ISyslogFindByFilterRepository } from '../../../domain/ports';
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { format } from 'date-fns';

@Injectable()
export class SyslogFindByFilterSqliteRepository implements ISyslogFindByFilterRepository {
  constructor(private readonly db: Database) {}

  async find(filter: FilterCondition | null | undefined): Promise<SyslogEntity[]> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);

    const query = `SELECT * FROM syslogs ${whereClause} ORDER BY created_at desc LIMIT 50`;
    const rs = await this.db.query(query, params);

    const items = rs.map((row) => {
      const formattedDate = format(new Date(row.created_at), 'yyyy-MM-dd HH:mm:ss');
      return new SyslogEntity({
        id: row.id,
        level: row.level,
        source: row.source,
        metadata: JSON.parse(row.metadata),
        message: row.message,
        createdAt: formattedDate,
      });
    });

    return items;
  }
}
