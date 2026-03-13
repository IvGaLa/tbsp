import { userCache } from '../../cache/userCache.js';
import { getUserByTelegramId } from '../../db/repositories/user.repository.js';

export async function cacheMiddleware(ctx, next) {
  const telegramId = ctx.from?.id;

  if (!telegramId) return next();

  let user;

  // if is cached
  if (userCache.has(telegramId)) {
    user = userCache.get(telegramId);
  } else {
    // get from db
    const _userDB = await getUserByTelegramId(telegramId);
    if (_userDB) {
      // if exists in DB
      userCache.set(telegramId, _userDB);
    } else {
      // if not exists
      // HERE need call a "setup" method to configure user
      // then return for no continue
    }
  }

  ctx.cache = user;

  return next();
}
