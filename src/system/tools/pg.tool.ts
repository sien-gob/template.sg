import { Pool, PoolClient, QueryResult } from 'pg';

export type QueryExecutor = (client: PoolClient) => Promise<QueryResult>;
export type FnTransaction<T> = (client: PoolClient) => Promise<T>;

export class DatabasePG {
  constructor(private readonly pool: Pool) {}

  /**
   * Ejecuta una consulta usando el queryExecutor proporcionado o una cadena de consulta.
   * @param {QueryExecutor | string} queryExecutor - La función queryExecutor o la cadena de consulta.
   * @param {any[]} [values] - Los valores que se usarán en la consulta si se proporciona una cadena de consulta.
   * @returns {Promise<T[]>} Las filas de resultados de la consulta.
   * @throws Lanzará un error si la ejecución de la consulta falla.
   * @example
   * const result = await Database.executeQuery('SELECT * FROM users');
   * const users = await executeQuery<UserEntity>('SELECT * FROM users WHERE client_id = $1', ['client1']);
   * const complexQuery = await executeQuery(async (client) => {
   *                      const usersResult = await client.query('SELECT * FROM users WHERE client_id = $1', ['client1']);
   *                      const profilesResult = await client.query('SELECT * FROM profiles WHERE client_id = $1', ['client1']);
   *
   *     // Hacer algún procesamiento con los resultados
   *     return []
   * });
   */
  async executeQuery<T = any>(queryExecutor: QueryExecutor | string, values?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      let result: QueryResult;
      if (typeof queryExecutor === 'function') {
        result = await queryExecutor(client);
      } else {
        result = await client.query(queryExecutor, values);
      }
      return result.rows as T[];
    } finally {
      client.release();
    }
  }

  /**
   * Ejecuta una serie de consultas dentro de una transacción.
   * @param {FnTransaction<T>} fn - La función callback que contiene las consultas de la transacción.
   * @returns {Promise<T>} El resultado de la transacción.
   * @throws Lanzará un error si la transacción falla y se revertirá la transacción.
   * @example
   * await executeTransaction(async (client) => {
   *        await client.query('INSERT INTO users (client_id, user_id, name) VALUES ($1, $2, $3)', ['client1', 'user1', 'John']);
   *        await client.query('UPDATE user_counts SET count = count + 1 WHERE client_id = $1', ['client1']);
   * });
   */
  async executeTransaction<T = any>(fn: FnTransaction<T>): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async processor<T>(process: () => Promise<T>, errors: { [key: string]: (message?:string) => void }): Promise<T> {
    try {
      return await process();
    } catch (error) {
      for (const key in errors) {
        if (error.message.includes(key)) {
          errors[key]();
        }
      }
      errors["default"](error.message);
    }
  }
}

