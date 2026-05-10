/**
 * Telegram Bot Starter Pack
 * Copyright (C) 2026 IvGaLa (https://github.com/IvGaLa/)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { Bot, type MiddlewareFn } from 'grammy';

import i18next from './i18n/index.js';
import { config } from './config/config.js';

import type { ConfigDirs } from './types/config/configdirs.types.js';

import type { TbspConfig, Handler, ResourceHandler, CustomContext } from './types/tbsp.types.js';

/**
 * Example _configBot
const _configBot = {
  BOT_TOKEN: 'token', // string
  loadDefaultHandlers: bool or [], // Load default tbsp handlers. If true load all handlers, false load none, array only load handlers in array
  loadDefaultMiddleware: bool or [], // Load default tbsp middlewares. If true load all middlewares, false load none, array only load middlewares in array
  customHandlers: [], // Array with name of custom handlers to load (without suffix ".handler.js")
  customMiddlewares: [], // Array with name of custom middlewares to load (without suffix ".middleware.js")
};
 */

export class Tbsp extends Bot<CustomContext> {
  private _handlers: boolean;
  private _middlewares: boolean;

  private _handlersDir: ConfigDirs['handlers'];
  private _middlewaresDir: ConfigDirs['middlewares'];

  private __filename: string;
  private __dirname: string;

  constructor(_configBot: TbspConfig) {
    if (!_configBot?.BOT_TOKEN) {
      throw new Error(i18next.t('bot_token_required') as string);
    }

    super(_configBot.BOT_TOKEN);

    this._handlers = true;
    this._middlewares = true;

    this._handlersDir = config.dirs.handlers;
    this._middlewaresDir = config.dirs.middlewares;

    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);

    // Load default resources first
    if (_configBot?.loadDefaultMiddlewares) void this.loadDefaultMiddlewares();

    if (_configBot?.loadDefaultHandlers) void this.loadDefaultHandlers();

    if (this.validArrayOfStrings(_configBot?.customMiddlewares))
      void this.loadMiddlewares(_configBot.customMiddlewares, config.dirs.middlewares.custom);

    if (this.validArrayOfStrings(_configBot?.customHandlers))
      void this.loadHandlers(_configBot.customHandlers, config.dirs.handlers.custom);
  }

  // Check if value is an array of strings
  validArrayOfStrings(value: unknown = null): value is string[] {
    return Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === 'string');
  }

  async getAllFilesFromDir(dir: string, endsWith: string | null = null): Promise<string[]> {
    return fs
      .readdirSync(dir)
      .filter((file) => !endsWith || file.endsWith(endsWith))
      .sort();
  }

  async getResources(
    typeConfig: ConfigDirs['handlers'] | ConfigDirs['middlewares'],
    defaults: boolean | string[],
  ): Promise<string[]> {
    let items: string[] = [];

    if (typeof defaults === 'boolean' && defaults) {
      items = await this.getAllFilesFromDir(
        path.join(this.__dirname, typeConfig.dirName),
        typeConfig.fileName,
      );
    }

    if (items.length === 0 && Array.isArray(defaults)) {
      items = defaults;
    }

    return items;
  }

  async loadMiddlewares(middlewares: string[], _dir: string | null = null): Promise<void> {
    const dir = _dir || this._middlewaresDir.dirName;

    for (const name of middlewares) {
      const file = `${dir}${name}`;

      if (!fs.existsSync(file)) {
        continue;
      }

      const { default: fn } = (await import(file)) as {
        default: MiddlewareFn<CustomContext>;
      };

      this.use(fn);
    }
  }

  async loadHandlers(handlers: string[], _dir: string | null = null): Promise<void> {
    const dir = _dir || this._handlersDir.dirName;

    const resources: Record<string, ResourceHandler> = {};

    for (const handler of handlers) {
      const filePath = path.join(this.__dirname, dir, handler);

      const fileUrl = pathToFileURL(filePath).href;

      if (!fs.existsSync(filePath)) {
        continue;
      }

      const module = (await import(fileUrl)) as {
        default: Handler;
      };

      const resource = module.default;

      // Pass handler validations
      if (!this._isValidHandler(resource, fileUrl)) {
        continue;
      }

      // Normalize handler name
      const handlerName = resource.name.toLowerCase().trim();

      if (resources[handlerName]) {
        i18next.warnT('handlers.already_exists', {
          handler_name: handlerName,
          handler_filename: fileUrl,
          handler_filename_exists: resources[handlerName].__file,
        });

        continue;
      }

      resources[handlerName] = {
        ...resource,
        name: handlerName,
        __file: fileUrl,
      };

      this.command(resource.name, async (ctx) => {
        if (ctx.chat?.type !== 'private') {
          return;
        }

        const text = ctx.message?.text?.trim();

        if (!text) {
          return;
        }

        const args = text.split(' ').slice(1);

        try {
          await resource.execute(ctx, args);
        } catch (error) {
          const t = ctx.t('error_executing_command', {
            commandName: resource.name,
          });

          i18next.errorT(t);

          if (error instanceof Error) {
            i18next.errorT(error.message);
          }

          await ctx.replyT(t);
        }
      });
    }

    this.on('message:text', async (ctx) => {
      const text = ctx.message.text.trim();

      // Command not found
      if (text.startsWith(config.startWith)) {
        const command = text.split(' ')[0].slice(1).toLowerCase();

        if (!resources[command]) {
          await ctx.replyT('command_not_found', {
            commandName: command,
          });
        }
      } else {
        // anything else
        await ctx.replyT('what', { text });
      }
    });
  }

  _isValidHandler(handler: unknown, fileUrl: string): handler is Handler {
    if (!handler || typeof handler !== 'object') {
      i18next.errorT('handlers.validations.resource', {
        handler_filename: fileUrl,
      });

      return false;
    }

    if (!('name' in handler) || typeof handler.name !== 'string') {
      i18next.errorT('handlers.validations.name', {
        fileUrl,
      });

      return false;
    }

    if (!('execute' in handler) || typeof handler.execute !== 'function') {
      i18next.errorT('handlers.validations.execute', {
        fileUrl,
      });

      return false;
    }

    return true;
  }

  async loadDefaultHandlers(defaults: boolean | string[] = this._handlers): Promise<void> {
    const handlers = await this.getResources(this._handlersDir, defaults);

    await this.loadHandlers(handlers);
  }

  async loadDefaultMiddlewares(defaults: boolean | string[] = this._middlewares): Promise<void> {
    const middlewares = await this.getResources(this._middlewaresDir, defaults);

    await this.loadMiddlewares(middlewares, this._middlewaresDir.dirName);
  }

  async startBotPolling(): Promise<void> {
    await this.api.deleteWebhook();
    await this.start();
  }
}
