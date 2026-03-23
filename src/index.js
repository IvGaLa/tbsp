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

import { tbsp, startBotPolling } from './tbsp/tbsp.js';

import { startServer } from './server/express.js';
import { registerHandlers } from './tbsp/registerHandlers.js';

const middlewares = ['i18n', 'cache'];

const start = async () => {
  // Load middlewares
  for (const name of middlewares) {
    const middlewareFile = `./tbsp/middlewares/${name}.middleware.js`;
    const { default: middlewareFunc } = await import(middlewareFile);
    tbsp.use(middlewareFunc);
  }

  // Load handlers
  await registerHandlers(tbsp);

  if (config.NODE_ENV === 'production') {
    i18next.logT('webhook_mode');
    await startServer();
  } else {
    i18next.logT('polling_mode');
    startBotPolling();

    process.once('SIGINT', () => tbsp.stop());
    process.once('SIGTERM', () => tbsp.stop());
  }
};

start();
