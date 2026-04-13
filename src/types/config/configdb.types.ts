interface ConfigTurso {
  token?: string;
  url?: string;
  database_name?: string;
}

export interface ConfigDB {
  turso: ConfigTurso;
}
