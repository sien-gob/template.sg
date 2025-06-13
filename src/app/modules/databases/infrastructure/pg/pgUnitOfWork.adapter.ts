import { Pool, PoolClient } from 'pg';
import { IUnitOfWorkPort } from '../../domain/ports';
import { DatabaseException } from '../../domain/exceptions';
import { connectPg } from './pg.config';


export class PgUnitOfWorkAdapter implements IUnitOfWorkPort {
  private pool: Pool;
  private client: PoolClient;
  private repos: any[] = [];

  constructor() {
    this.pool = connectPg;
  }

  async register(repository: any): Promise<void> {
    this.repos.push(repository);
  }

  async complete<T>(repositories: () => Promise<void>, work: () => Promise<T>): Promise<T> {
    await repositories();

    if (this.repos.length > 0) {
      try {
        this.client = await this.pool.connect();
        await this.client.query('BEGIN');
        this.repos.forEach((repo) => {
          repo.setClient(this.client);
        });
        const result = await work();
        await this.client.query('COMMIT');
        return result;
      } catch (error) {
        await this.client.query('ROLLBACK');
        throw error;
      } finally {
        this.client.release();
        this.repos.forEach((repo) => repo.setClient(null));
        this.repos = [];
      }
    } else {
      throw new DatabaseException({ message: 'Debe registrar los repositorios' });
    }
  }
}
