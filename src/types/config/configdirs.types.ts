interface ConfigDir {
  dirName: string;
  fileName: string;
  custom: string;
}

export interface ConfigDirs {
  handlers: ConfigDir;
  middlewares: ConfigDir;
}
