import 'dotenv/config';
import * as joi from 'joi';

const envVarsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { error, value } = envVarsSchema.validate({
  ...process.env,
  NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface Env {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const env: Env = value as Env;

export const envs = {
  PORT: env?.PORT,
  DATABASE_URL: env?.DATABASE_URL,
  NATS_SERVERS: env?.NATS_SERVERS,
};
