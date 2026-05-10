export interface Resource {
  name: string;
  execute: (...args: unknown[]) => unknown;
  __file?: string;
}

export type Resources = Record<string, Resource>;
