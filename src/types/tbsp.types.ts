import { type Context } from 'grammy';

export interface TbspConfig {
  BOT_TOKEN: string;

  loadDefaultMiddlewares?: boolean;
  loadDefaultHandlers?: boolean;

  customMiddlewares?: string[];
  customHandlers?: string[];
}

export interface Handler {
  name: string;
  execute: (ctx: Context, args: string[]) => Promise<void>;
}

export interface ResourceHandler extends Handler {
  __file?: string;
}

export interface CustomContext extends Context {
  t: (key: string, options?: Record<string, unknown>) => string;
  replyT: (
    key: string,
    options?: Record<string, unknown>,
    extra?: Parameters<Context['reply']>[1],
  ) => Promise<unknown>;
}
