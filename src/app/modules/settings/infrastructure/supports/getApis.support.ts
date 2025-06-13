import { Database } from 'src/system/databases';
import { FilterCondition, SqlFilterBuilder } from 'src/app/modules/shared/common';
import { ApiEntity } from '../../domain/entities';

export class GetApisSupport {
  static async getApis(filter: FilterCondition | null | undefined): Promise<ApiEntity[]> {
    const { whereClause, params } = SqlFilterBuilder.build(filter);
    const query = `
            select *
            from (SELECT 
                          api.id, 
                          api.type, 
                          api.name, 
                          api.url, 
                          api.description, 
                          COALESCE(ctx.id, '') AS metadata_context_id,
                          COALESCE(ctx.type, '') AS metadata_context_type,
                          COALESCE(ctx.name, '') AS metadata_context_name
                      FROM apis api
                      LEFT JOIN context_apis cc ON cc.api_id = api.id 
                      LEFT JOIN contexts ctx ON cc.context_id = ctx.id) as tblapis
             ${whereClause}`;

    const rs = await Database.staticQuery(query, params);
    const items = rs.map((row) => {
      return new ApiEntity({
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
        url: row.url,
        description: row.description,
      });
    });

    return items;
  }
}
