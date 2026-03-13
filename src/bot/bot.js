import { config } from '../config/config.js';
import { Bot } from 'grammy';

export const bot = new Bot(config.BOT_TOKEN);

export const startBotPolling = async () => {
  await bot.api.deleteWebhook();
  await bot.start(); // polling
};
