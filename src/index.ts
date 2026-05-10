import i18next from './i18n/index.js';

import { config } from './config/config.js';

import { Tbsp } from './tbsp.js';
import { TbspServer } from './lib/TbspServer.js';

import type { TbspConfig } from './types/tbsp.types.js';

const start = async (): Promise<void> => {
  const _configBot: TbspConfig = {
    BOT_TOKEN: config.BOT_TOKEN,

    loadDefaultHandlers: true,
    loadDefaultMiddlewares: true,

    // customHandlers: ['myCustomHandler', 'otherCustomHandler'],
    // customMiddlewares: ['myCustomMiddleware', 'otherCustomMiddleware'],
  };

  const tbsp = new Tbsp(_configBot);

  if (config.NODE_ENV === 'production') {
    i18next.logT('webhook_mode');

    const server = new TbspServer(tbsp);

    await server.start();
  } else {
    i18next.logT('polling_mode');

    await tbsp.startBotPolling();

    process.once('SIGINT', () => {
      tbsp.stop();
    });

    process.once('SIGTERM', () => {
      tbsp.stop();
    });
  }
};

void start();
