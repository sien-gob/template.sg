import { Database } from 'src/system/databases';
import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { ConnectiondbEntity } from '../../domain/entities';

export class GetConnectionsSupport {
  static async getConnections(filter: FilterCondition | null | undefined): Promise<ConnectiondbEntity[]> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);
    const query = `
            select *
            from (SELECT 
                          cdb.id, 
                          cdb.type, 
                          cdb.name, 
                          cdb.server, 
                          cdb.database, 
                          cdb.username, 
                          cdb.password, 
                          cdb.description, 
                          COALESCE(ctx.id, '') AS metadata_context_id,
                          COALESCE(ctx.type, '') AS metadata_context_type,
                          COALESCE(ctx.name, '') AS metadata_context_name
                      FROM connectiondbs cdb
                      LEFT JOIN context_connectiondb cc ON cc.connectiondb_id = cdb.id 
                      LEFT JOIN contexts ctx ON cc.context_id = ctx.id) as connects
             ${whereClause}`;

    const rs = await Database.staticQuery(query, params);

    const items = rs.map((row) => {
      return new ConnectiondbEntity({
        metadata: {
          context: {
            id: row.metadata_context_id,
            type: row.metadata_context_type,
            name: row.metadata_context_name,
          },
        },
        id: row.id,
        type: row.type,
        name: row.name,
        server: row.server,
        database: row.database,
        username: row.username,
        password: row.password,
        description: row.description,
      });
    });
    return items;
  }
}
