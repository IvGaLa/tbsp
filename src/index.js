import i18next from './tbsp/i18n/index.js';

import { config } from './tbsp/config/config.js';
import { Tbsp } from './tbsp/tbsp.js';
import { TbspServer } from './tbsp/lib/TbspServer.js';

const start = async () => {
  const _config = {
    BOT_TOKEN: config?.BOT_TOKEN,
    loadDefaultHandlers: true,
    loadDefaultMiddleware: true,
    // Example: customHandlers: ['custom.handler.js'],
    // Example: customMiddlewares: ['custom.middleware.js'],
  };

  const tbsp = new Tbsp(_config);

  if (config.NODE_ENV === 'production') {
    i18next.logT('webhook_mode');

    const server = new TbspServer(tbsp);

    await server.start();
  } else {
    i18next.logT('polling_mode');
    tbsp.startBotPolling();

    process.once('SIGINT', () => tbsp.stop());
    process.once('SIGTERM', () => tbsp.stop());
  }
};

start();
