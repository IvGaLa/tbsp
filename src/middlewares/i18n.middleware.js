import i18next from '../i18n/index.js';
import { i18next as i18nextConfig } from '../config/i18next.js';

const i18nMiddleware = async (ctx, next) => {
  const lang = ctx.from?.language_code?.split('-')[0] || i18nextConfig.defaultLang;

  ctx.lang = lang;

  ctx.t = (key, options = {}) => {
    return i18next.t(key, {
      lng: lang,
      ...options,
    });
  };

  ctx.replyT = (key, opt = {}, extra = {}) => {
    return ctx.reply(ctx.t(key, opt), extra);
  };

  return next();
};

export default i18nMiddleware;
