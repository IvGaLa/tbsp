import { config } from './tbsp/config/config.js';

import i18next from './tbsp/i18n/index.js';

import { Tbsp } from './tbsp/tbsp.js';

import { registerHandlers } from './tbsp/lib/registerHandlers.js';

const middlewares = ['i18n', 'cache'];

const tbsp = new Tbsp();

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
    await tbsp.startServer();
  } else {
    i18next.logT('polling_mode');
    tbsp.startBotPolling();

    process.once('SIGINT', () => tbsp.stop());
    process.once('SIGTERM', () => tbsp.stop());
  }
};

start();
