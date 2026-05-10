import { config } from '../config/config.js';

import { loadResources } from './loadResources.js';

import type { Tbsp } from '../tbsp.js';

import type { CustomContext, ResourceHandler } from '../types/tbsp.types.js';

export const registerHandlers = async (bot: Tbsp): Promise<void> => {
  const { dirName, fileName } = config.dirs.handlers;

  const handlers = (await loadResources(dirName, fileName)) as Record<string, ResourceHandler>;

  for (const key in handlers) {
    const handler = handlers[key];

    bot.command(handler.name, async (ctx: CustomContext) => {
      if (ctx.chat?.type !== 'private') {
        return;
      }

      const text = ctx.message?.text?.trim();

      if (!text) {
        return;
      }

      const args = text.split(' ').slice(1);

      try {
        await handler.execute(ctx, args);
      } catch (error) {
        const t = ctx.t('error_executing_command', {
          commandName: handler.name,
        });

        console.log(t, error);

        await ctx.replyT(t);
      }
    });
  }

  bot.on('message:text', async (ctx: CustomContext) => {
    const text = ctx.message?.text?.trim();

    if (!text?.startsWith('/')) {
      await ctx.replyT('what', { text });
      return;
    }

    const command = text.split(' ')[0].slice(1).toLowerCase();

    if (!handlers[command]) {
      await ctx.replyT('command_not_found', {
        commandName: command,
      });
    }
  });
};
