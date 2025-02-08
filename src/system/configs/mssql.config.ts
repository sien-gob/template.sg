import { ConnectionPool, config } from 'mssql';
import { envs } from './environment.config';

const poolConfig: config = {
  user: envs.repository.connect.mssql.user,
  password: envs.repository.connect.mssql.password,
  server: envs.repository.connect.mssql.server,
  database: envs.repository.connect.mssql.data,
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

export const connectMssql = new ConnectionPool(poolConfig);