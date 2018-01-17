var i18n = require('./i18n');

export const keys = {
  FATAL: 10,
  ERROR: 20,
  WARN: 30,
  INFO: 40,
  DEBUG: 50,
  TRACE: 60,
  AUDIT: 98,
  METRIC: 99
}

export const levels = {
  off: 1,
  fatal: 10,
  error: 20,
  warn: 30,
  info: 40,
  debug: 50,
  trace: 60,
  audit: 98,
  metric: 99
};

export const levelNames = {
  10: 'fatal',
  20: 'error',
  30: 'warn',
  40: 'info',
  50: 'debug',
  60: 'trace',
  98: 'audit',
  99: 'metric'
};
