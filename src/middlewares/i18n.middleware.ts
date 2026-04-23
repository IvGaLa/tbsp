import i18next from '../i18n/index.js';
import { i18next as i18nextConfig } from '../config/i18next.js';

import type { TOptions, ReplyExtra, I18nContext } from '../types/domain/i18n.types.js';
import type { NextFunction } from 'grammy';

const i18nMiddleware = async (ctx: I18nContext, next: NextFunction) => {
  const lang = ctx.from?.language_code?.split('-')[0] || i18nextConfig.defaultLang;

  ctx.lang = lang;

  ctx.t = (key: string, options: TOptions = {}) => {
    return i18next.t(key, {
      lng: lang,
      ...options,
    }) as string;
  };

  ctx.replyT = (key: string, opt: TOptions = {}, extra: ReplyExtra = {}) => {
    return ctx.reply(ctx.t(key, opt), extra);
  };

  return next();
};

export default i18nMiddleware;
