import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { i18next as i18nextConf } from '../config/i18next.js';

class I18next {
  __filename = fileURLToPath(import.meta.url);
  __dirname = path.dirname(this.__filename);
  i18n = i18next;

  constructor() {
    const { resources, namespaces } = this.loadLocales();

    this.i18n
      .use({
        type: 'logger',
        log() {},
        warn() {},
        error() {},
      })
      .init({
        showSupportNotice: false,
        debug: false,
        resources,
        fallbackLng: i18nextConf.defaultLang,
        ns: namespaces,
        defaultNS: namespaces,
        interpolation: { escapeValue: false },
      });
  }

  loadLocales() {
    const localesPath = path.join(this.__dirname, i18nextConf.dirName);
    const languages = fs.readdirSync(localesPath);

    const resources = {};
    const namespaces = new Set();

    for (const lang of languages) {
      const langPath = path.join(localesPath, lang);
      const files = fs.readdirSync(langPath);

      resources[lang] = {};

      for (const file of files) {
        if (!file.endsWith('.json')) continue;

        const ns = file.replace('.json', '');
        const filePath = path.join(langPath, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        namespaces.add(ns);
        resources[lang][ns] = content;
      }
    }

    return {
      resources,
      namespaces: Array.from(namespaces),
    };
  }

  // Extending i18next to use console.log, console.error, etc... witch colors
  consoleT(_msg, _options = {}, _type = null, _color = null) {
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      purple: '\x1b[35m',
      cyan: '\x1b[36m',
      white: '\x1b[37m',
    };

    const methods = {
      error: { method: 'error', color: colors[_color] || colors.red },
      warn: { method: 'warn', color: colors[_color] || colors.yellow },
      info: { method: 'log', color: colors[_color] || colors.blue },
      default: { method: 'log', color: colors[_color] || colors.white },
    };

    const { method, color } = methods[_type] || methods.default;
    const text = i18next.t(_msg, _options);

    console[method](`${color}${text}${colors.reset}`);
  }

  // Access methods for 'error', 'warn', 'info', 'log'
  errorT(_msg, _options = {}) {
    this.consoleT(_msg, _options, 'error');
  }

  warnT(_msg, _options = {}) {
    this.consoleT(_msg, _options, 'warn');
  }

  infoT(_msg, _options = {}) {
    this.consoleT(_msg, _options, 'info');
  }

  logT(_msg, _options = {}) {
    this.consoleT(_msg, _options, 'log');
  }
}

export default new I18next();
