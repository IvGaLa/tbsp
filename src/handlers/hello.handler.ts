import type { Command } from '../types/handlers.types.js';

const command: Command = {
  name: 'hello',
  execute: async (ctx) => {
    await ctx.reply('Hello world!');
  },
};

export default command;
