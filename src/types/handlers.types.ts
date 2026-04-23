import type { Context } from 'grammy';

export interface Command {
  name: string;
  execute: (ctx: Context) => Promise<void>;
}
