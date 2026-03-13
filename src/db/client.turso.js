import { createClient } from '@libsql/client';
import { db } from '../config/db.js';

/**
 * Creating Turso client
 */

export const tursoClient = createClient({
  url: db.turso.url,
  authToken: db.turso.token,
});
