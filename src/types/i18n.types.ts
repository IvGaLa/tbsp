export const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  white: '\x1b[37m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
} as const;

type ColorName = keyof typeof colors;

export const messages: Record<
  ConsoleType,
  {
    method: 'log' | 'warn' | 'error';
    color: ColorName;
  }
> = {
  success: {
    method: 'log',
    color: 'green',
  },

  error: {
    method: 'error',
    color: 'red',
  },

  warn: {
    method: 'warn',
    color: 'yellow',
  },

  info: {
    method: 'log',
    color: 'blue',
  },

  log: {
    method: 'log',
    color: 'white',
  },
};

export type ConsoleType = 'error' | 'warn' | 'info' | 'log' | 'success';
