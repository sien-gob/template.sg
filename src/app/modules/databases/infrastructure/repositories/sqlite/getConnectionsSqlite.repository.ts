import { Injectable } from '@nestjs/common';

import { Database } from 'src/system/databases';
import { ConnectionEntity } from '../../../domain/entities';
import { IGetConnections } from '../../../domain/ports';

@Injectable()
export class GetConnectionsSqliteRepository implements IGetConnections {
  constructor(private readonly db: Database) {}

  async getConnection(name: string): Promise<ConnectionEntity> {
    const sql = `
        SELECT * FROM connections WHERE name = ?;
    `;
    const rs = await this.db.query(sql, [name]);

    const items = rs.map((row) => {
      return new ConnectionEntity({
        id: row.id,
        name: row.name,
        connection: JSON.parse(row.connection),
        description: row.description,
      });
    });

    return items[0];
  }
}
