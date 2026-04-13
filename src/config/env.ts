import type { ConfigEnv } from '../types/config/configenv.types.js';

function getEnvVar(name: string): string {
  return process.env[name] || '';
}

export const env: ConfigEnv = {
  BOT_TOKEN: getEnvVar('BOT_TOKEN'),
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  WEBHOOK_URL: getEnvVar('WEBHOOK_URL'),
  WEBHOOK_SECRET: getEnvVar('WEBHOOK_SECRET'),
};
