import * as i18n from 'i18n'

import {
  Context
} from '../context'

import {
  Settings
} from '../settings'

import {
  LogHandler
} from './log-handler'

import {
  keys
} from './constants'

import {
  ILogMessage
} from './interfaces'

export interface ILogger {
  addHandler(func: Function)
  removeHandler(func: Function)
  log(msg: ILogMessage)
  info(msg: any): void
  warn(msg: any)
  error(msg: any)
  trace(msg: any)
  debug(msg: any)
  metric()
  audit(msg: ILogMessage, req: any)
  _: Function
}

export class Logger extends Context implements ILogger {
  metricsEnabled: boolean = false
  logHandlers = []
  loggerSettings = {}

  // TODO: Fix - use service injection
  settings = new Settings()
  verbose: boolean
  _: Function

  constructor(settings: any = {}) {
    super()

    let {
      metricsEnabled,
      logHandlers,
      loggerSettings
    } = this

    const {
      addHandler
    } = this.rebind([
        'addHandler'
      ])

    this.verbose = settings.verbose;

    if (settings.logging) {
      var keys = Object.keys(settings.logging);
      if (keys.length === 0) {
        addHandler(new LogHandler());
      } else {
        for (var i = 0, l = keys.length; i < l; i++) {
          var config = settings.logging[keys[i]];
          loggerSettings = config || {};
          if ((keys[i] === 'console') || config.handler) {
            addHandler(new LogHandler(loggerSettings));
          }
        }
      }
    } else {
      addHandler(new LogHandler());
    }

    this['_'] = i18n._
  }

  addHandler(func: Function) {
    this.logHandlers.push(func);
  }
  removeHandler(func: Function) {
    let {
      logHandlers
    } = this

    var index = logHandlers.indexOf(func);
    if (index > -1) {
      logHandlers.splice(index, 1);
    }
  }

  log(msg: ILogMessage) {
    msg.timestamp = Date.now();
    this.logHandlers.forEach(function (handler) {
      handler.emit('log', msg);
    });
  }

  info(msg: any): void {
    this.log({ level: keys.INFO, msg: msg });
  }

  warn(msg: any) {
    this.log({ level: keys.WARN, msg: msg });
  }

  error(msg: any) {
    this.log({ level: keys.ERROR, msg: msg });
  }

  trace(msg: any) {
    this.log({ level: keys.TRACE, msg: msg });
  }

  debug(msg: any) {
    this.log({ level: keys.DEBUG, msg: msg });
  }

  metric() {
    return this.metricsEnabled;
  }

  audit(msg: ILogMessage, req: any) {
    msg.level = keys.AUDIT;
    if (req) {
      msg.user = req.user;
      msg.path = req.path;
      msg.ip = (req.headers && req.headers['x-forwarded-for']) || (req.connection && req.connection.remoteAddress) || undefined;
    }
    this.log(msg);
  }
}

