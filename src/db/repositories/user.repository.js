import { db } from '../index.js';

export const getUserByTelegramId = async (telegramId) => {
  const sql = `SELECT telegram_id, timezone
    FROM users
    WHERE telegram_id = ? AND active = 1;`;

  const rows = await db.query(sql, [telegramId]);

  return rows[0] ?? null;
};
