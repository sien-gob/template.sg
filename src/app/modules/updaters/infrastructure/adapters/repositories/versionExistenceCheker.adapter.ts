import { BasePgRepository } from 'src/app/modules/databases/infrastructure';
import { IVersionExistenceCheckerRepository } from '../../../domain/ports/repositories';
import { UpdaterException } from '../../../domain/exceptions';
import { DatabaseTools } from '@sien-gob/tools';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VersionExistenceCheckerPgAdapter extends BasePgRepository implements IVersionExistenceCheckerRepository {
  protected configureErrors(): { [key: string]: (message?: string) => void } {
    return {
      default: (message?: string) => {
        throw new UpdaterException({ message: message || 'Error desconocido' });
      },
    };
  }

  async exists(checksum: string): Promise<boolean> {
    const query = 'SELECT 1 FROM sys.versionesdb WHERE checksum = $1';

    const values = [checksum];
    const process = async (): Promise<boolean> => {
      return await this.executeQuery<boolean>(async (client) => {
        const result = await client.query<any>(query, values);
        //result.rows.length > 0;
        return (result.rowCount ?? 0) > 0;
      });
    };

    return await DatabaseTools.processor<boolean>(process, this.configureErrors());
  }
}
