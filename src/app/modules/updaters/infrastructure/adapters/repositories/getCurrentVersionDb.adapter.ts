import { BasePgRepository } from 'src/app/modules/databases/infrastructure';
import { IGetCurrentVersionRepository, CurrentVersion } from '../../../domain/ports/repositories';
import { UpdaterException } from '../../../domain/exceptions';
import { DatabaseTools } from '@sien-gob/tools';
import { Injectable } from '@nestjs/common';


@Injectable()
export class GetCurrentVersionDbPgAdapter extends BasePgRepository implements IGetCurrentVersionRepository {
  protected configureErrors(): { [key: string]: (message?: string) => void } {
    return {
      default: (message?: string) => {
        throw new UpdaterException({ message: message || 'Error desconocido' });
      },
    };
  }

  async getVersion(): Promise<CurrentVersion[]> {
    const query = 'SELECT * FROM sys.parametros WHERE idparametro = $1 and idtipo = $2 and context = $3';

    const values = ['VER-CORE', 'VER', 'DB_VERSION'];
    const process = async (): Promise<CurrentVersion[]> => {
      return await this.executeQuery<CurrentVersion[]>(async (client) => {
        const result = await client.query<any>(query, values);
        if (result.rows.length === 0) return [];
        const items = result.rows.map((item) => ({
          codigo: item.codigo,
          nombre: item.nombre,
          descripcion: item.descripcion,
          valor: item.valor
        }) as CurrentVersion);
        return items;
      });
    };

    return await DatabaseTools.processor<CurrentVersion[]>(process, this.configureErrors());
  }
}
