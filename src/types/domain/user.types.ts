export interface User {
  id: number;
  telegramId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  timezone?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
