import type { ConfigDirs } from '../types/config/configdirs.types.js';

export const dirs: ConfigDirs = {
  handlers: {
    dirName: './handlers/',
    fileName: '.handler.js',
    custom: 'custom/',
  },
  middlewares: {
    dirName: './middlewares/',
    fileName: '.middleware.js',
    custom: 'custom/',
  },
};
