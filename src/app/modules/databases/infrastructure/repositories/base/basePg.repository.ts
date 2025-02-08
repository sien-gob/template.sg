import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { connectPg } from 'src/system/configs';
import { DatabaseException } from '../../../domain/exceptions';

@Injectable()
export abstract class BasePgRepository {
  protected client: PoolClient;

  setClient(client?: PoolClient) {
    this.client = client || null;
  }

  getClient(): PoolClient {
    if (!this.client) {
      throw new DatabaseException({ message: 'No se ha inicializado el cliente de la base de datos' });
    }
    return this.client;
  }

  protected async executeQuery<T = any>(queryExecutor: (client: PoolClient) => Promise<T>): Promise<T> {
    let temporaryClient = false;
    let clientPg = null;

    if (!this.client) {
      clientPg = await connectPg.connect();
      temporaryClient = true;
    } else {
      clientPg = this.client;
    }

    try {
      return await queryExecutor(clientPg);
    } finally {
      if (temporaryClient) {
        clientPg.release();
      }
    }
  }

  protected abstract configureErrors(): { [key: string]: (message?: string) => void };
}
