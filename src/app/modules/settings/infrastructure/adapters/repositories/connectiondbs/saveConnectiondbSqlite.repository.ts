/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Database } from 'src/system/databases';
import { ISaveConnectiondbRepository } from '../../../../domain/ports/repositories';
import { CreateConnectiondbEntity } from '../../../../domain/entities';
import { SettingException } from 'src/app/modules/settings/domain/exceptions';

@Injectable()
export class SaveConnectiondbSqliteRepository implements ISaveConnectiondbRepository {
  constructor(private readonly db: Database) {}

  async save(input: CreateConnectiondbEntity): Promise<void> {
    const sql = `
      INSERT INTO connectiondbs (id, type, name, server, database, username, password, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
          type = excluded.type,
          name= excluded.name,
          server = excluded.server,
          database = excluded.database,
          username = excluded.username,
          password = excluded.password,
          description = excluded.description
      RETURNING *;
    `;

    const params = [input.id, input.type, input.name, input.server, input.database, input.username, input.password, input.description];

    try {
      const rs = await this.db.query(sql, params);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: connectiondbs.name')) {
        throw new SettingException({ message: 'El nombre de la Conexión ya existe. Por favor, elige otro nombre.' });
      }
      throw error;
    }
  }
}
