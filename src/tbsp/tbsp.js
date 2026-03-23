import { config } from '../config/config.js';
import { Bot } from 'grammy';

export const tbsp = new Bot(config.BOT_TOKEN);

export const startBotPolling = async () => {
  await tbsp.api.deleteWebhook();
  await tbsp.start(); // polling
};
