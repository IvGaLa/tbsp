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
import { Bot } from 'grammy';

import i18next from './i18n/index.js';

import { config } from './config/config.js';

/**
 * Example _config
const _config = {
  BOT_TOKEN: 'token', // string
  loadDefaultHandlers: bool or [], // Load default tbsp handlers. If true load all handlers, false load none, array only load handlers in array
  loadDefaultMiddleware: bool or [], // Load default tbsp middlewares. If true load all middlewares, false load none, array only load middlewares in array
  customHandlers: [], // Array with name of custom handlers to load
  customMiddlewares: [], // Array with name of custom middlewares to load
};
 */

export class Tbsp extends Bot {
  constructor(_config = null) {
    if (!_config?.BOT_TOKEN) {
      throw new Error(i18next.t('bot_token_required'));
    }

    super(_config.BOT_TOKEN);

    this._handlers = true;
    this._middlewares = true;
    this._handlersDir = config.dirs.handlers;
    this._middlewaresDir = config.dirs.middlewares;

    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);

    // If we want load default middlewares or handlers, we load them before any custom one, so custom one can override default ones if they want
    if (_config?.loadDefaultMiddlewares) this.loadDefaultMiddlewares();
    if (_config?.loadDefaultHandlers) this.loadDefaultHandlers();

    if (this.validArrayOfStrings(_config?.customMiddlewares))
      this.loadMiddlewares(_config.customMiddlewares, config.dirs.middlewares.custom);

    if (this.validArrayOfStrings(_config?.customHandlers))
      this.loadHandlers(_config.customHandlers, config.dirs.handlers.custom);
  }

  // Check if value is an array of strings
  validArrayOfStrings(value = null) {
    return Array.isArray(value) && value.length > 0 && value.every((v) => typeof v === 'string');
  }

  async getAllFilesFromDir(dir, endsWith = null) {
    return fs
      .readdirSync(dir)
      .filter((file) => !endsWith || file.endsWith(endsWith))
      .sort();
  }

  async getResources(typeConfig, defaults) {
    let items = [];

    if (typeof defaults === 'boolean' && defaults) {
      items = await this.getAllFilesFromDir(
        path.join(this.__dirname, typeConfig.dirName),
        typeConfig.fileName,
      );
    }

    if (items.length === 0) items = defaults;
    return items;
  }

  async loadMiddlewares(middlewares, _dir = null) {
    const dir = _dir || this._middlewaresDir.dirName;
    for (const name of middlewares) {
      const file = `${dir}${name}`;

      if (!fs.existsSync(file)) {
        // TO-DO: Log warning about missing middleware file
        continue;
      }

      const { default: fn } = await import(file);
      this.use(fn);
    }
  }

  async loadHandlers(handlers, _dir = null) {
    const dir = _dir || this._handlersDir.dirName;
    const resources = {};
    for (const handler of handlers) {
      const filePath = path.join(this.__dirname, dir, handler);

      const fileUrl = pathToFileURL(filePath).href;

      if (!fs.existsSync(filePath)) {
        // TO-DO: Log warning about missing handler file
        continue;
      }

      const module = await import(fileUrl);

      const resource = module.default;

      //Pass handler validations
      if (!this._isValidHandler(resource, fileUrl)) continue;

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
        if (ctx.chat.type !== 'private') return;

        const text = ctx.message.text.trim();
        const args = text.split(' ').slice(1);

        try {
          await resource.execute(ctx, args);
        } catch (error) {
          const t = await ctx.t('error_executing_command', { commandName: resource.name });
          i18next.errorT(t);
          i18next.errorT(error);
          await ctx.replyT(t);
        }
      });
    }

    this.on('message:text', async (ctx) => {
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
  }

  _isValidHandler(handler, fileUrl) {
    if (!handler || typeof handler !== 'object') {
      i18next.errorT('handlers.validations.resource', { handler_filename: fileUrl });
      return false;
    }

    if (!handler.name || typeof handler.name !== 'string') {
      i18next.errorT('handlers.validations.name', { fileUrl });
      return false;
    }

    if (typeof handler.execute !== 'function') {
      i18next.errorT('handlers.validations.execute', { fileUrl });
      return false;
    }

    return true;
  }

  async loadDefaultHandlers(defaults = this._handlers) {
    const handlers = await this.getResources(this._handlersDir, defaults);
    this.loadHandlers(handlers);
  }

  async loadDefaultMiddlewares(defaults = this._middlewares) {
    const middlewares = await this.getResources(this._middlewaresDir, defaults);
    this.loadMiddlewares(middlewares, this._middlewaresDir.dirName);
  }

  async startBotPolling() {
    await this.api.deleteWebhook();
    await this.start(); // polling
  }
}
