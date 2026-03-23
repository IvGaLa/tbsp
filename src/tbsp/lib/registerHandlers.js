import { config } from '../config/config.js';
import { loadResources } from './loadResources.js';

export const registerHandlers = async (bot) => {
  const { dirName, fileName } = config.dirs.handlers;
  const handlers = await loadResources(dirName, fileName);

  for (const key in handlers) {
    const handler = handlers[key];

    bot.command(handler.name, async (ctx) => {
      if (ctx.chat.type !== 'private') return;

      const text = ctx.message.text.trim();
      const args = text.split(' ').slice(1);

      try {
        await handler.execute(ctx, args);
      } catch (error) {
        const t = await ctx.t('error_executing_command', { commandName: handler.name });
        console.log(t, error);
        await ctx.replyT(t);
      }
    });
  }

  bot.on('message:text', async (ctx) => {
    const text = ctx.message.text.trim();

    // Command not found
    if (text.startsWith('/')) {
      const command = text.split(' ')[0].slice(1).toLowerCase();
      if (!handlers[command]) {
        await ctx.replyT(await ctx.t('command_not_found', { commandName: command }));
      }

      // anything else
    } else {
      await ctx.replyT('what', { text });
    }
  });
};
