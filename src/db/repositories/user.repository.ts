import { DbUser } from '../../types/db/dbuser.types.js';
import { db } from '../index.js';

export const getUserByTelegramId = async (telegramId: number): Promise<DbUser | null> => {
  const sql = `SELECT *
    FROM users
    WHERE telegram_id = ? AND active = 1;`;

  const rows = await db.query(sql, [telegramId]);

  return rows[0] ?? null;
};
