import { Database } from 'src/system/databases';
import { DatabaseConfig } from '../../../domain/models';
import { ISaveCurrentVersionRepository } from '../../../domain/ports/repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaveCurrentVersionAppSqlliteAdapter implements ISaveCurrentVersionRepository {
  constructor(private readonly db: Database) {}

  async save(config: DatabaseConfig): Promise<void> {
    const query = `
      INSERT INTO parameters (code, data, description)
      VALUES ('VERDB', ?, ?)
      ON CONFLICT(code) DO UPDATE SET
        data = excluded.data,
        description = excluded.description;
    `;

    const data = JSON.stringify(config.version);
    const params = [data, 'Version de la base de datos que usa el backend'];
    const rs = await this.db.query(query, params);
  }
}
