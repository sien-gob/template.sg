import { Injectable } from '@nestjs/common';
import { BasePgRepository } from '../../pg/basePg.repository';
import { IDisableTableIndexesRepository } from '../../../domain/ports';
import { DatabaseException } from '../../../domain/exceptions';
import { DatabaseTools } from '@sien-gob/tools';

@Injectable()
export class DisableTableIndexesPgRepository extends BasePgRepository implements IDisableTableIndexesRepository {
  protected configureErrors(): { [key: string]: (message?: string) => void } {
    return {
      default: (message?: string) => {
        throw new DatabaseException({ message: message || 'Error desconocido' });
      },
    };
  }

  async disable(tableName: string): Promise<void> {
    const query = `SELECT indexname FROM pg_indexes WHERE tablename = $1;`;
    const values = [tableName];

    const process = async (): Promise<boolean> => {
      return await this.executeQuery<boolean>(async (client) => {
        const res = await client.query(query, values);

        for (const row of res.rows) {
          await client.query(`ALTER INDEX ${row.indexname} DISABLE;`);
        }

        return true;
      });
    };

    await DatabaseTools.processor<boolean>(process, this.configureErrors());
  }
}
