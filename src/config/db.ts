import type { ConfigDB } from '../types/config/configdb.types.js';

export const db: ConfigDB = {
  turso: {
    token: process.env.TURSO_TOKEN,
    url: process.env.TURSO_URL,
    database_name: process.env.TURSO_DATABASE_NAME,
  },
};
