import { BasePgRepository } from 'src/app/modules/databases/infrastructure';
import { ISaveCurrentVersionRepository } from '../../../domain/ports/repositories';
import { UpdaterException } from '../../../domain/exceptions';
import { DatabaseTools } from '@sien-gob/tools';
import { DatabaseConfig } from '../../../domain/models';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SaveCurrentVersionDbPgAdapter extends BasePgRepository implements ISaveCurrentVersionRepository {
  protected configureErrors(): { [key: string]: (message?: string) => void } {
    return {
      default: (message?: string) => {
        throw new UpdaterException({ message: message || 'Error desconocido' });
      },
    };
  }

  async save(config: DatabaseConfig): Promise<void> {
    const query = `
        INSERT INTO sys.parametros (idparametro, idtipo, context, codigo, nombre, valor, description, orden)
        VALUES ('VER-CORE', 'VER', 'DB_VERSION', $1, $2, $3, $4, $5)
          ON CONFLICT (idparametro, idtipo, context) 
          DO UPDATE SET 
            codigo = EXCLUDED.codigo,
            nombre = EXCLUDED.nombre,
            valor = EXCLUDED.valor,
            description = EXCLUDED.description,
            orden = EXCLUDED.orden
    `;

    const { codigo, nombre, valor, descripcion } = config.version;
    const values = [codigo, nombre, valor, descripcion, '1'];

    const process = async (): Promise<boolean> => {
      return await this.executeQuery<boolean>(async (client) => {
        const result = await client.query<any>(query, values);
        //result.rows.length > 0;
        return (result.rowCount ?? 0) > 0;
      });
    };

    await DatabaseTools.processor<boolean>(process, this.configureErrors());
  }
}
