import type { ReminderStatus } from '../unions.types.js';

export interface Reminder {
  id: number;
  userId: number;
  message: string;
  scheduledAtUtc: Date;
  executedAtUtc?: Date;
  status: ReminderStatus;
  createdAt: Date;
  updatedAt: Date;
}
