import { ConnectionPool, Transaction } from 'mssql';

import { DatabaseException } from '../../../domain/exceptions';

import { IUnitOfWorkPort } from '../../../domain/ports';
import { connectMssql } from 'src/system/configs/mssql.config';

export class MssqlUnitOfWorkAdapter implements IUnitOfWorkPort {
  private pool: ConnectionPool;
  private transaction: Transaction;
  private repos: any[] = [];

  constructor() {
    this.pool = connectMssql;
  }

  async register(repository: any): Promise<void> {
    this.repos.push(repository);
  }

  async complete<T>(repositories: () => Promise<void>, work: () => Promise<T>): Promise<T> {
    await repositories();
    if (this.repos.length > 0) {
      try {
        await this.pool.connect();
        this.transaction = new Transaction(this.pool);
        await this.transaction.begin();
        this.repos.forEach((repo) => {
          repo.setTransaction(this.transaction);
        });
        const result = await work();
        await this.transaction.commit();
        return result;
      } catch (error) {
        await this.transaction.rollback();
        throw error;
      } finally {
        this.repos.forEach((repo) => repo.setTransaction(null));
        this.repos = [];
      }
    } else {
      throw new DatabaseException({ message: 'Debe registrar los repositorios' });
    }
  }
}
