import { ConnectionEntity } from '../../../domain/entities';
import { Database } from 'src/system/databases';
import { ConnectionNameType } from '../../../domain/types';

export class GetConnectionsSqliteService {
  static async getConnection(name: ConnectionNameType): Promise<ConnectionEntity> {
    const sql = `
      SELECT * FROM connections WHERE name = ?;
    `;
    const rs = await Database.staticQuery(sql, [name]);
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
