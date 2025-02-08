import { Injectable } from '@nestjs/common';
import { Transaction } from 'mssql';
import { DatabaseException } from '../../../domain/exceptions';
import { ConnectionPool, config } from 'mssql';
import { GetConnectionsSqliteService } from '../sqlite/getConnectionsSqliteService.repository';
import { ConnectionNameType } from '../../../domain/types';

@Injectable()
export abstract class BaseByConnectionNameMssqlRepository {
  protected transaction: Transaction;
  protected connectMssql: ConnectionPool;

  setTransaction(transaction?: Transaction) {
    this.transaction = transaction || null;
  }

  getTransaction(): Transaction {
    if (!this.transaction) {
      throw new DatabaseException({ message: 'No se ha inicializado la transacción de la base de datos' });
    }
    return this.transaction;
  }

  protected async executeQuery<T = any>(connectionName: ConnectionNameType, queryExecutor: (transaction: Transaction) => Promise<T>): Promise<T> {
    let temporaryTransaction = false;
    let transactionMssql: Transaction = null;
    const result = await GetConnectionsSqliteService.getConnection(connectionName);
    const connection = result.connection;

    if (!connection) throw new DatabaseException({ message: 'No se encontro la conexión de sql server' });

    const poolConfig: config = {
      server: connection.server,
      database: connection.database,
      user: connection.uid,
      password: connection.pwd,
      options: {
        encrypt: false, // For Azure
        trustServerCertificate: false, // Change to true for local dev / self-signed certs
      },
      pool: {
        max: 20,
        min: 0,
        idleTimeoutMillis: 30000,
      },
    };

    if (!this.transaction) {
      this.connectMssql = new ConnectionPool(poolConfig);
      await this.connectMssql.connect();
      transactionMssql = new Transaction(this.connectMssql);
      await transactionMssql.begin();
      temporaryTransaction = true;
    } else {
      transactionMssql = this.transaction;
    }

    try {
      const result = await queryExecutor(transactionMssql);
      if (temporaryTransaction) {
        await transactionMssql.commit();
      }
      return result;
    } catch (error) {
      if (temporaryTransaction) {
        await transactionMssql.rollback();
      }
      throw error;
    } finally {
      if (temporaryTransaction) {
        await this.connectMssql.close();
      }
    }
  }

  protected abstract configureErrors(): { [key: string]: (message?: string) => void };
}
