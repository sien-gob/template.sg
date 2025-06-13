/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { ISaveApiRepository } from '../../../../domain/ports/repositories';
import { CreateApiEntity } from '../../../../domain/entities';
import { SettingException } from 'src/app/modules/settings/domain/exceptions';

@Injectable()
export class SaveApiSqliteRepository implements ISaveApiRepository {
  constructor(private readonly db: Database) {}

  async save(input: CreateApiEntity): Promise<void> {
    const sql = `
      INSERT INTO apis (id, type, name, url, description)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
          type = excluded.type,
          name= excluded.name,
          url = excluded.url,
          description = excluded.description
      RETURNING *;
    `;

    const params = [input.id, input.type, input.name, input.url, input.description];

    try {
      const rs = await this.db.query(sql, params);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: apis.name')) {
        throw new SettingException({ message: 'El nombre de la API ya existe. Por favor, elige otro nombre.' });
      }
      throw error;
    }
  }
}
