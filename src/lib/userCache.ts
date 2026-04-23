import QuickLRU from 'quick-lru';
import { cache } from '../config/cache.js';

import type { DbUser } from '../types/db/dbuser.types.js';

export const userCache = new QuickLRU<number, DbUser>({
  maxSize: cache.maxSize,
});
