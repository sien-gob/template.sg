import 'dotenv/config';
import { config } from 'dotenv';
import * as joi from 'joi';

config({ path: `.env.${process.env.NODE_ENV}` });

interface EnvVars {
  PORT: number;
  REPOSITORY: string;
  DB_PG_USER: string;
  DB_PG_PASSWORD: string;
  DB_PG_SERVER: string;
  DB_PG_DATA: string;
  DB_PG_PORT: number;
  JWT_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
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
    JWT_KEY: joi.string().required(),
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().required(),
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
    },
  },
  keys: {
    jwt: envVars.JWT_KEY,
  },
};
