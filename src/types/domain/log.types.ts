import type { LogTypes } from '../unions.types.js';

export interface Log {
  id: number;
  userId?: number;
  type: LogTypes;
  message: string;
  createdAt: Date;
}
