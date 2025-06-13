import { BasePgRepository } from 'src/app/modules/databases/infrastructure';
import { CreateFileVersionProps, ICreateFileVersionRepository } from '../../../domain/ports/repositories';
import { UpdaterException } from '../../../domain/exceptions';
import { DatabaseTools } from '@sien-gob/tools';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateFileVersionPgAdapter extends BasePgRepository implements ICreateFileVersionRepository {
  protected configureErrors(): { [key: string]: (message?: string) => void } {
    return {
      default: (message?: string) => {
        throw new UpdaterException({ message: message || 'Error desconocido' });
      },
    };
  }

  async create(props: CreateFileVersionProps): Promise<void> {
    const query = `INSERT INTO sys.versionesdb (checksum,  result, nombre, descripcion) VALUES ($1, $2, $3, $4)`;

    const values = [props.checksum, props.result, props.name, props.description];

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
