import type { LogTypes } from './unions.types.js';

export interface DbLog {
  id: number;
  user_id: number | null;
  type: LogTypes;
  message: string;
  created_at: string;
}
