export default {
  name: 'hello', // Command name (without /): /hello
  execute: async (ctx) => {
    await ctx.reply('This is second handler!');
  },
};
