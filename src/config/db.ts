import type { ConfigDB } from '../types/config/configdb.types.js';

import { getEnvVar } from '../lib/utils.js';

export const db: ConfigDB = {
  turso: {
    token: getEnvVar('TURSO_TOKEN'),
    url: getEnvVar('TURSO_URL'),
    database_name: getEnvVar('TURSO_DATABASE_NAME'),
  },
};
