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

export default i18next;
