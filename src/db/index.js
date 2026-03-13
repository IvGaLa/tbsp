import { tursoClient } from './client.turso.js';
import { Database } from './Database.js';

/**
 * Create singleton Database
 */

export const db = new Database(tursoClient);
