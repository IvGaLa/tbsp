import express from 'express';
import { webhookCallback } from 'grammy';
import { tbsp } from '../tbsp.js';
import { config } from '../config/config.js';
import i18next from '../i18n/index.js';

export const startServer = async () => {
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
  app.use(webhookPath, webhookCallback(tbsp, 'express'));

  // Registrar webhook en Telegram
  await tbsp.api.deleteWebhook();
  await tbsp.api.setWebhook(`${config.WEBHOOK_URL}${webhookPath}`);

  app.listen(config.PORT, () => {
    console.log(i18next.t('server_listen', { port: config.PORT }));
  });
};
