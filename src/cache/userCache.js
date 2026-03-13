import QuickLRU from 'quick-lru';
import { cache } from '../config/cache.js';

export const userCache = new QuickLRU({
  maxSize: cache.maxSize,
});
