/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { IApplyContextApiRepository } from '../../../../domain/ports/repositories';

@Injectable()
export class ApplyContextApiSqliteRepository implements IApplyContextApiRepository {
  constructor(private readonly db: Database) {}

  async apply(contextId: string, apiId: string): Promise<void> {
    const db = await this.db.getDataBase();
    try {
      await db.exec('BEGIN TRANSACTION');
      const sqlDelConnect = `delete from context_apis where api_id = ?;`;
      await this.db.query(sqlDelConnect, [apiId]);

      const sqlDelContext = `delete from context_apis where context_id = ?;`;
      await this.db.query(sqlDelContext, [contextId]);


      const sql = `
        INSERT INTO context_apis (context_id, api_id)
        VALUES (?, ?)
        ON CONFLICT(context_id, api_id) DO NOTHING
        RETURNING *;
      `;

      const params = [contextId, apiId];
      await this.db.query(sql, params);

      await db.exec('COMMIT');
    } catch (error) {
      await db.exec('ROLLBACK');
      throw error;
    }
  }
}
