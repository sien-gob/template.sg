import { Injectable } from '@nestjs/common';
import { IGetCurrentVersionRepository, CurrentVersion } from '../../../domain/ports/repositories';
import { Database } from 'src/system/databases';

@Injectable()
export class GetCurrentVersionAppSqlliteAdapter implements IGetCurrentVersionRepository {
  constructor(private readonly db: Database) {}

  async getVersion(): Promise<CurrentVersion[]> {
    const query = 'SELECT * FROM parameters WHERE code = ? ';
    const params = ['VERDB'];
    const rs = await this.db.query(query, params);
    const items = rs.map((row) => {
      const value = JSON.parse(row.data);
      return {
        codigo: value.codigo,
        nombre: value.nombre,
        valor: value.valor,
        descripcion: value.descripcion,
      } as CurrentVersion;
    });

    return items;
  }
}
