import i18next from 'i18next';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { i18next as i18nextConf } from '../config/i18next.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadLocales() {
  const localesPath = path.join(__dirname, i18nextConf.dirName);
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

const { resources, namespaces } = loadLocales();

await i18next
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

// Extending i18next to use console.log, console.error, etc... witch colors
i18next.consoleT = (_msg, _options = {}, _type = null, _color = null) => {
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
};

// Access methods for 'error', 'warn', 'info', 'log'
i18next.errorT = (_msg, _options = {}) => {
  i18next.consoleT(_msg, _options, 'error');
};

i18next.warnT = (_msg, _options = {}) => {
  i18next.consoleT(_msg, _options, 'warn');
};

i18next.infoT = (_msg, _options = {}) => {
  i18next.consoleT(_msg, _options, 'info');
};

i18next.logT = (_msg, _options = {}) => {
  i18next.consoleT(_msg, _options, 'log');
};

export default i18next;
