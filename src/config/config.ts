import { dirs } from './dirs.js';
import { db } from './db.js';
import { env } from './env.js';
import { cache } from './cache.js';
import { i18next as i18nextConf } from './i18next.js';

import i18next from '../i18n/index.js';

export const config = {
  dirs,
  db,
  cache,
  i18next: i18nextConf,
  ...env,
};

if (!config.BOT_TOKEN) {
  throw new Error(i18next.t('bot_token_required') as string);
}
