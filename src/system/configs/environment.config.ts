import 'dotenv/config';
import { config } from 'dotenv';
import Joi, * as joi from 'joi';

config({ path: `.env.${process.env.NODE_ENV}` });

interface EnvVars {
  PORT: number;
  REPOSITORY: string;
  DB_PG_USER: string;
  DB_PG_PASSWORD: string;
  DB_PG_SERVER: string;
  DB_PG_DATA: string;
  DB_PG_PORT: number;
  DB_MSSQL_USER: string;
  DB_MSSQL_PASSWORD: string;
  DB_MSSQL_SERVER: string;
  DB_MSSQL_DATA: string;
  DB_MSSQL_PORT: number;
  JWT_KEY: string;
  JWT_REFRESH_KEY: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  SOCKET_GATEWAY_PORT: number;
  SOCKET_GATEWAY_SG_BASE_URL: string;
  CLIENT_ID: string;
  MAIL_HOST: string;
  MAIL_USER: string;
  MAIL_PASSWORD: string;
  MAIL_FROM: string;
  MAIL_SUPPORT: string;
  MAIL_RECEPTOR: string;
  TEST_SYSLOG: boolean;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    REPOSITORY: joi.string().required(),
    DB_PG_USER: joi.string().required(),
    DB_PG_PASSWORD: joi.string().required(),
    DB_PG_SERVER: joi.string().required(),
    DB_PG_DATA: joi.string().required(),
    DB_PG_PORT: joi.number().required(),
    DB_MSSQL_USER: joi.string().required(),
    DB_MSSQL_PASSWORD: joi.string().required(),
    DB_MSSQL_SERVER: joi.string().required(),
    DB_MSSQL_DATA: joi.string().required(),
    DB_MSSQL_PORT: joi.number().required(),
    JWT_KEY: joi.string().required(),
    JWT_REFRESH_KEY: joi.string().required(),
    JWT_ACCESS_EXPIRES_IN: joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().required(),
    SOCKET_GATEWAY_PORT: joi.number().required(),
    SOCKET_GATEWAY_SG_BASE_URL: joi.string().required(),
    CLIENT_ID: joi.string().required(),

    MAIL_HOST: joi.string().required(),
    MAIL_USER: joi.string().required(),
    MAIL_PASSWORD: joi.string().required(),
    MAIL_FROM: joi.string().required(),
    MAIL_SUPPORT: joi.string().required(),
    MAIL_RECEPTOR: joi.string().required(),
    TEST_SYSLOG: joi.boolean().required(),
  })
  .unknown(true);
const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Error en la config de envs: ${error.message}`);
}

const envVars: EnvVars = value;
export const envs = {
  system: {
    port: envVars.PORT,
    test_syslog: envVars.TEST_SYSLOG,
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
  },
  repository: {
    source: envVars.REPOSITORY,
    connect: {
      pg: {
        user: envVars.DB_PG_USER,
        password: envVars.DB_PG_PASSWORD,
        server: envVars.DB_PG_SERVER,
        data: envVars.DB_PG_DATA,
        port: envVars.DB_PG_PORT,
      },
      mssql: {
        user: envVars.DB_MSSQL_USER,
        password: envVars.DB_MSSQL_PASSWORD,
        server: envVars.DB_MSSQL_SERVER,
        data: envVars.DB_MSSQL_DATA,
        port: envVars.DB_MSSQL_PORT,
      },
    },
  },
  keys: {
    jwt: envVars.JWT_KEY,
    jwt_refresh: envVars.JWT_REFRESH_KEY,
    jwt_access_expires_in: envVars.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: envVars.JWT_REFRESH_EXPIRES_IN,
  },
  client: {
    id: envVars.CLIENT_ID,
  },
  gateway: {
    port: envVars.SOCKET_GATEWAY_PORT,
  },
  messenger: {
    email: {
      host: envVars.MAIL_HOST,
      user: envVars.MAIL_USER,
      password: envVars.MAIL_PASSWORD,
      from: envVars.MAIL_FROM,
      support: envVars.MAIL_SUPPORT,
      receptor: envVars.MAIL_RECEPTOR,
    },
  },
  endpoints: {
    core: {
      socketGateway: envVars.SOCKET_GATEWAY_SG_BASE_URL,
    },
  },
};

export type EditEnvInput = { type: string; value: string };

const actionEnv: Record<string, (input: EditEnvInput) => void> = {
  'API-001': (input) => {
    //envs.endpoints.sg.importer = input.value;
  },
};

export function editEnvironment(input: EditEnvInput) {
  const action = actionEnv[input.type];
  if (action) {
    action(input);
  }
}
