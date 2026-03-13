import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadResources(dirName, fileName) {
  const resourceDir = path.join(__dirname, dirName);

  const files = fs.readdirSync(resourceDir).filter((file) => file.endsWith(fileName));

  const resources = {};

  for (const file of files) {
    const filePath = path.join(resourceDir, file);
    const fileUrl = pathToFileURL(filePath).href;

    const module = await import(fileUrl);
    const resource = module.default;

    resources[resource.name] = resource;
  }

  return resources;
}
