import { Transaction, IResult } from 'mssql';

export type QueryExecutor = (transaction: Transaction) => Promise<IResult<any>>;
export type FnTransaction<T> = (transaction: Transaction) => Promise<T>;
