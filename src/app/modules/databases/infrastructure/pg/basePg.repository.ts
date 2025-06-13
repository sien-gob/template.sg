import { Injectable } from '@nestjs/common';
import { PoolClient, QueryResult } from 'pg';
import { DatabaseException } from '../../domain/exceptions';
import { connectPg, initializePool } from './pg.config';

export type QueryExecutor<T = any> = (client: PoolClient) => Promise<T>;
export type FnTransaction<T = any> = (client: PoolClient) => Promise<T>;

@Injectable()
export abstract class BasePgRepository {
  protected client: PoolClient | null = null;
  private readonly clientMessage: string =
    'No se ha inicializado el cliente de la base de datos. Registre la conexión del contexto SE, consulte con soporte y vuelva a intentarlo.';

  setClient(client?: PoolClient) {
    this.client = client ?? null;
  }

  async getClient(): Promise<PoolClient> {
    if (!this.client) {
      await initializePool();
      throw new DatabaseException({message: this.clientMessage});
    }
    return this.client;
  }

  protected async executeQuery<T = any>(queryExecutor: QueryExecutor<T>): Promise<T> {
    let temporaryClient = false;
    let clientPg: PoolClient | null = null;

    if (!connectPg) {
      await initializePool();
    }

    if (!connectPg) {
      throw new DatabaseException({ message: this.clientMessage });
    }

    if (!this.client) {
      clientPg = await connectPg.connect();
      temporaryClient = true;
    } else {
      clientPg = this.client;
    }

    try {
      return await queryExecutor(clientPg!);
    } finally {
      if (temporaryClient) {
        if (clientPg) clientPg?.release();
      }
    }
  }

  // Método para ejecutar transacciones
  protected async executeTransaction<T=any>(fnTransaction: FnTransaction<T>): Promise<T> {
    let temporaryClient = false;
    let clientPg: PoolClient | null = null;

    if (!connectPg) {
      await initializePool();
    }

    if (!connectPg) {
      throw new DatabaseException({ message: this.clientMessage });
    }

    if (!this.client) {
      clientPg = await connectPg.connect();
      temporaryClient = true;
    } else {
      clientPg = this.client;
    }

    try {
      await clientPg.query('BEGIN');
      const result = await fnTransaction(clientPg);
      await clientPg.query('COMMIT');
      return result;
    } catch (error) {
      await clientPg.query('ROLLBACK');
      throw error;
    } finally {
      if (temporaryClient) {
        if (clientPg) clientPg?.release();
      }
    }
  }

  protected abstract configureErrors(): { [key: string]: (message?: string) => void };
}
