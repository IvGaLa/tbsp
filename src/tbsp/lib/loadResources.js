import fs from 'fs';
import i18next from '../i18n/index.js';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadResources(dirName, fileName) {
  const resourceDir = path.join(__dirname, '..', dirName);

  // Sorting handlers files
  const files = fs
    .readdirSync(resourceDir)
    .filter((file) => file.endsWith(fileName))
    .sort();

  const resources = {};

  for (const file of files) {
    const filePath = path.join(resourceDir, file);
    const fileUrl = pathToFileURL(filePath).href;

    const module = await import(fileUrl);
    const resource = module.default;

    if (!resource || typeof resource !== 'object') {
      // Resource is not an object
      i18next.errorT('handlers.validations.resource', { handler_filename: fileUrl });
      continue;
    }

    if (!resource.name || typeof resource.name !== 'string') {
      // resource.name is not a string or not exists
      i18next.errorT('handlers.validations.name', { fileUrl });
      continue;
    }

    if (typeof resource.execute !== 'function') {
      // resource.execute is not a function
      i18next.errorT('handlers.validations.execute', { fileUrl });
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
  }

  return resources;
}
