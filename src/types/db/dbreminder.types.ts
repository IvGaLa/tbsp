import type { ReminderStatus } from './unions.types.js';

export interface DbReminder {
  id: number;
  user_id: number;
  message: string;
  scheduled_at_utc: string;
  executed_at_utc: string | null;
  status: ReminderStatus;
  created_at: string;
  updated_at: string;
}
