/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { ISyslogSaveRepository } from '../../../domain/ports';
import { CreateSyslogEntity, SyslogEntity } from '../../../domain/entities';
import { format } from 'date-fns';

@Injectable()
export class SyslogSaveSqliteRepository implements ISyslogSaveRepository {
  constructor(private readonly db: Database) {}

  async save(input: CreateSyslogEntity): Promise<SyslogEntity> {
    const sql = `
      INSERT INTO syslogs (level, source, metadata, message)
      VALUES (?, ?, ?, ?)
      RETURNING *;
    `;

    const params = [input.level, input.source, input.metadata, input.message];
    const rs = await this.db.query(sql, params);

    const items = rs.map((row) => {
      const formattedDate = format(new Date(row.created_at), 'yyyy-MM-dd HH:mm:ss');

      return new SyslogEntity({
        id: row.id,
        level: row.level,
        source: row.source,
        metadata: row.metadata,
        message: row.message,
        createdAt: formattedDate,
      });
    });

    return items[0];
  }
}
