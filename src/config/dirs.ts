import type { ConfigDirs } from '../types/config/configdirs.types.js';

export const dirs: ConfigDirs = {
  handlers: {
    dirName: './handlers/', // path for tbsp handlers
    fileName: '.handler.js', // suffix por handlers files
    custom: 'custom/', // path for custom handlers
  },
  middlewares: {
    dirName: './middlewares/', // path for tbsp middlewares
    fileName: '.middleware.js', // suffix por middlewares files
    custom: 'custom/', // path for custom middlewares
  },
};
