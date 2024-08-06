import { Pool, PoolConfig } from "pg";
import { envs } from "./environment.config";
import { DatabasePG } from "../tools/pg.tool";

const poolConfig: PoolConfig = {
  user: envs.repository.connect.pg.user,
  password: envs.repository.connect.pg.password,
  host: envs.repository.connect.pg.server,
  port: envs.repository.connect.pg.port,
  database: envs.repository.connect.pg.data,

  // Configuración del pool
  max: 20, // número máximo de clientes en el pool
  idleTimeoutMillis: 30000, // tiempo máximo que un cliente puede estar inactivo en el pool
  connectionTimeoutMillis: 2000, // tiempo máximo para establecer una conexión
  
};

export const connectPg = new Pool(poolConfig);
export const dbPg = new DatabasePG(connectPg);