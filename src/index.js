/**
 * My memory is failing me
 * Copyright (C) 2026 IvGaLa (https://github.com/IvGaLa/)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { config } from './config/config.js';

import i18next from './i18n/index.js';

import { bot, startBotPolling } from './bot/bot.js';

import { startServer } from './server/express.js';
import { registerHandlers } from './bot/registerHandlers.js';
import { i18nMiddleware } from './bot/middlewares/i18n.middleware.js';
import { cacheMiddleware } from './bot/middlewares/cache.middleware.js';

const start = async () => {
  // Load middlewares
  bot.use(i18nMiddleware); // i18n middleware
  bot.use(cacheMiddleware); // Cache middleware

  // Load handlers
  await registerHandlers(bot);

  if (config.NODE_ENV === 'production') {
    console.log(i18next.t('webhook_mode'));
    await startServer();
  } else {
    console.log(i18next.t('polling_mode'));
    startBotPolling();

    process.once('SIGINT', () => bot.stop());
    process.once('SIGTERM', () => bot.stop());
  }
};

start();
