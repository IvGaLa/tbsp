import type { Context } from 'grammy';

export type TOptions = Record<string, unknown>;
export type ReplyExtra = Parameters<Context['reply']>[1];

export interface I18nContext extends Context {
  lang: string;
  t: (key: string, options?: TOptions) => string;
  replyT: (key: string, opt?: TOptions, extra?: ReplyExtra) => Promise<unknown>;
}
