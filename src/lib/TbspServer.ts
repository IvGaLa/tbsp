import express, { type Express, type Request, type Response } from 'express';
import { webhookCallback } from 'grammy';

import { config } from '../config/config.js';
import i18next from '../i18n/index.js';
import type { Tbsp } from '../tbsp.js';

export class TbspServer {
  private bot: Tbsp;

  private app: Express;

  private webhookPath!: string;

  constructor(bot: Tbsp) {
    if (!bot) {
      throw new Error(i18next.t('bot_instance_required'));
    }

    this.bot = bot;

    this.app = express();
  }

  setupMiddleware(): void {
    this.app.use(express.json());
  }

  setupRoutes(): void {
    // Healthcheck
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'ok',

        uptime: process.uptime(),

        timestamp: Date.now(),
      });
    });

    const webhookPath = `/webhook/${config.WEBHOOK_SECRET}`;

    // Telegram webhook endpoint
    this.app.use(webhookPath, webhookCallback(this.bot, 'express'));

    this.webhookPath = webhookPath;
  }

  async registerWebhook(): Promise<void> {
    await this.bot.api.deleteWebhook();

    await this.bot.api.setWebhook(`${config.WEBHOOK_URL}${this.webhookPath}`);
  }

  async start(): Promise<void> {
    this.setupMiddleware();

    this.setupRoutes();

    await this.registerWebhook();

    this.app.listen(config.PORT, () => {
      i18next.infoT('server_listen', {
        port: config.PORT,
      });
    });
  }
}
