export interface DbUser {
  id: number;
  telegram_id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  timezone: string | null;
  active: 0 | 1;
  created_at: string;
  updated_at: string;
}
