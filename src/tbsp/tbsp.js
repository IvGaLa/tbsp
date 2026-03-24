/**
 * Telegram Bot Starter Pack
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

import express from 'express';
import { webhookCallback, Bot } from 'grammy';

import i18next from './i18n/index.js';

import { config } from './config/config.js';

/**
 * Example _config
const _config = {
  BOT_TOKEN: 'token', // string
  loadDefaultHandlers: bool or [], // Load default tbsp handlers. If true load all handlers, false load none, array only load handlers in array
  loadDefaultMiddleware: bool or [], // Load default tbsp middlewares. If true load all middlewares, false load none, array only load middlewares in array
};
 */

export class Tbsp extends Bot {
  constructor(_config = null) {
    super(_config?.BOT_TOKEN ?? config.BOT_TOKEN);
    this.loadDefaultHandlers(_config);
    this.loadDefaultMiddlewares(_config);
  }

  loadDefaultHandlers() {
    //
  }

  loadDefaultMiddlewares() {
    //
  }

  async startBotPolling() {
    await this.api.deleteWebhook();
    await this.start(); // polling
  }

  async startServer() {
    const app = express();

    app.use(express.json());

    // Healthcheck
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: Date.now(),
      });
    });

    const webhookPath = `/webhook/${config.WEBHOOK_SECRET}`;

    // Endpoint webhook Telegram
    app.use(webhookPath, webhookCallback(this, 'express'));

    // Registrar webhook en Telegram
    await this.api.deleteWebhook();
    await this.api.setWebhook(`${config.WEBHOOK_URL}${webhookPath}`);

    app.listen(config.PORT, () => {
      console.log(i18next.t('server_listen', { port: config.PORT }));
    });
  }
}
