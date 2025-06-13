/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { IApplyContextConnectiondbRepository, IGetConnectiondbsByFilterRepository } from '../../../../domain/ports/repositories';

@Injectable()
export class ApplyContextConnectiondbSqliteRepository implements IApplyContextConnectiondbRepository {
  constructor(
    private readonly db: Database,
  ) {}

  async apply(contextId: string, connectionId: string): Promise<void> {
    const db = await this.db.getDataBase();
    try {
      await db.exec('BEGIN TRANSACTION');
      const sqlDelConnect = `delete from context_connectiondb where connectiondb_id = ?;`;
      await this.db.query(sqlDelConnect, [connectionId]);

      const sqlDelContext = `delete from context_connectiondb where context_id = ?;`;
      await this.db.query(sqlDelContext, [contextId]);

      const sql = `
        INSERT INTO context_connectiondb (context_id, connectiondb_id)
        VALUES (?, ?)
        ON CONFLICT(context_id, connectiondb_id) DO NOTHING
        RETURNING *;
      `;

      const params = [contextId, connectionId];
      await this.db.query(sql, params);

      await db.exec('COMMIT');
    } catch (error) {
      await db.exec('ROLLBACK');
      throw error;
    }
  }
}
