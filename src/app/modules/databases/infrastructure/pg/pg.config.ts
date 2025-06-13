import { Logger } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';
import { GetConnectionsSupport } from 'src/app/modules/settings/infrastructure/supports';

export let connectPg: Pool;

export async function initializePool(): Promise<void> {
  const connectSE = await GetConnectionsSupport.getConnections({ filter: { metadata_context_name: 'SIENGOB' } });
  if (!connectSE || connectSE.length <= 0 || !connectSE[0].server.includes(":")) {
    return;
  }

  const cnt = connectSE[0];
  const host = cnt.server.split(':')[0].trim();
  const port = parseInt(cnt.server.split(':')[1].trim());


  const poolConfig: PoolConfig = {
    user: cnt.username,
    password: cnt.password,
    host: host,
    port: port,
    database: cnt.database,
    max: 20, // número máximo de clientes en el pool
    idleTimeoutMillis: 30000, // tiempo máximo que un cliente puede estar inactivo en el pool
    connectionTimeoutMillis: 2000, // tiempo máximo para establecer una conexión
  };

  connectPg = new Pool(poolConfig);
  const lg = new Logger('InitializePool-PG');
  lg.log('Se inicio el pool de PG ...');
}
