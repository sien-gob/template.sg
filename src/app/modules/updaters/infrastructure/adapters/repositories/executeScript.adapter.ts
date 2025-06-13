import { BasePgRepository } from 'src/app/modules/databases/infrastructure';
import { IExecuteScriptRepository, ResultScript } from '../../../domain/ports/repositories';
import { UpdaterException } from '../../../domain/exceptions';
import { DatabaseTools } from '@sien-gob/tools';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExecuteScriptPgAdapter extends BasePgRepository implements IExecuteScriptRepository {
  protected configureErrors(): { [key: string]: (message?: string) => void } {
    return {
      default: (message?: string) => {
        throw new UpdaterException({ message: message || 'Error desconocido' });
      },
    };
  }

  async execute(scriptContent: string): Promise<ResultScript> {
    const process = async (): Promise<ResultScript> => {
      return await this.executeQuery<ResultScript>(async (client) => {
        try {
          await client.query(scriptContent);
          return {
            status: 'success',
            message: 'Se proceso correctamente el script',
          };
        } catch (error) {
          return {
            status: 'error',
            message: error.message,
          };
        }
      });
    };

    return await DatabaseTools.processor<ResultScript>(process, this.configureErrors());
  }
}
