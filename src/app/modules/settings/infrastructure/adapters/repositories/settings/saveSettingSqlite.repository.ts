/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { ISaveSettingRepository } from '../../../../domain/ports/repositories';
import { CreateSettingEntity } from '../../../../domain/entities';

@Injectable()
export class SaveSettingSqliteRepository implements ISaveSettingRepository {
  constructor(private readonly db: Database) {}

  async save<T>(input: CreateSettingEntity<T>): Promise<void> {
    const sql = `
      INSERT INTO settings (id, data)
      VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET
          data = excluded.data;
      RETURNING *;
    `;

    const params = [input.id, JSON.stringify(input.data)];
    const rs = await this.db.query(sql, params);
  }
}
