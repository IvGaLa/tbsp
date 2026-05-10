import i18next, { type i18n, type Resource, type TOptions } from 'i18next';

import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

import { i18next as i18nextConf } from '../config/i18next.js';

import { colors, messages, type ConsoleType } from '../types/i18n.types.js';

class I18next {
  private i18n: i18n;

  private __filename: string;
  private __dirname: string;

  constructor() {
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);

    this.i18n = i18next.createInstance();

    const { resources, namespaces } = this.loadLocales();

    void this.i18n
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

        interpolation: {
          escapeValue: false,
        },
      });
  }

  t(key: string, options: TOptions = {}): string {
    return this.i18n.t(key, options) as string;
  }

  loadLocales(): {
    resources: Resource;
    namespaces: string[];
  } {
    const localesPath = path.join(this.__dirname, i18nextConf.dirName);

    const languages = fs.readdirSync(localesPath);

    const resources: Resource = {};

    const namespaces = new Set<string>();

    for (const lang of languages) {
      const langPath = path.join(localesPath, lang);

      const files = fs.readdirSync(langPath);

      resources[lang] = {};

      for (const file of files) {
        if (!file.endsWith('.json')) {
          continue;
        }

        const ns = file.replace('.json', '');

        const filePath = path.join(langPath, file);

        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>;

        namespaces.add(ns);

        resources[lang][ns] = content;
      }
    }

    return {
      resources,
      namespaces: Array.from(namespaces),
    };
  }

  // Extending i18next to use console.log, console.error, etc... with colors
  consoleT(_msg: string, _options: TOptions = {}, _type: ConsoleType = 'log'): void {
    const config = messages[_type];

    const color = colors[config.color];

    const text = this.t(_msg, _options);

    console[config.method](`${color}${text}${colors.reset}`);
  }

  // Access methods for 'error', 'warn', 'info', 'log', 'success'

  errorT(_msg: string, _options: TOptions = {}): void {
    this.consoleT(_msg, _options, 'error');
  }

  warnT(_msg: string, _options: TOptions = {}): void {
    this.consoleT(_msg, _options, 'warn');
  }

  infoT(_msg: string, _options: TOptions = {}): void {
    this.consoleT(_msg, _options, 'info');
  }

  logT(_msg: string, _options: TOptions = {}): void {
    this.consoleT(_msg, _options, 'log');
  }

  successT(_msg: string, _options: TOptions = {}): void {
    this.consoleT(_msg, _options, 'success');
  }
}

export default new I18next();
