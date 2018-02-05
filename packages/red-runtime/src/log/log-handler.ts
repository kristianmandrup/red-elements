const EventEmitter = require('events').EventEmitter

import {
  Context
} from '../context'

import {
  util
} from '../_libs'

import {
  levelNames,
  levels,
  keys
} from './constants'

interface LogSettings {
}

import {
  ILogMessage
} from './interfaces'

export interface ILogHandler {
  shouldReportMessage(msglevel: number)
  consoleLogger(msg: ILogMessage)
}

export class LogHandler extends Context {
  logLevel: number
  metricsOn: boolean
  auditOn: boolean
  handler: Function

  logHandlers = [];
  verbose: boolean
  metricsEnabled: boolean = false;
  keys = keys

  // TODO: use LogSettings type, rename to options
  constructor(settings?: any) {
    super()

    let {
      metricsEnabled
    } = this

    const {
      consoleLogger
    } = this.rebind([
        'consoleLogger'
      ])

    this.logLevel = settings ? levels[settings.level] || levels.info : levels.info;
    this.metricsOn = settings ? settings.metrics || false : false;
    this.auditOn = settings ? settings.audit || false : false;

    metricsEnabled = metricsEnabled || this.metricsOn;

    this.handler = (settings && settings.handler) ? settings.handler(settings) : consoleLogger;

    // on EventEmitter via util.inherits
    this['on']('log', function (msg) {
      if (this.shouldReportMessage(msg.level)) {
        this.handler(msg);
      }
    });

    this.setInstanceVars({
      metricsEnabled
    })
  }


  shouldReportMessage(msglevel: number) {
    const {
      METRIC,
      AUDIT
    } = this.keys
    return (msglevel == METRIC && this.metricsOn) ||
      (msglevel == AUDIT && this.auditOn) ||
      msglevel <= this.logLevel;
  }

  consoleLogger(msg: ILogMessage) {
    const {
      verbose
    } = this
    const {
      METRIC,
      AUDIT
    } = this.keys

    if (msg.level == METRIC || msg.level == AUDIT) {
      util.log('[' + levelNames[msg.level] + '] ' + JSON.stringify(msg));
    } else {
      if (verbose && msg.msg.stack) {
        util.log('[' + levelNames[msg.level] + '] ' + (msg.type ? '[' + msg.type + ':' + (msg.name || msg.id) + '] ' : '') + msg.msg.stack);
      } else {
        var message = msg.msg;
        if (typeof message === 'object' && message.toString() === '[object Object]' && message.message) {
          message = message.message;
        }
        util.log('[' + levelNames[msg.level] + '] ' + (msg.type ? '[' + msg.type + ':' + (msg.name || msg.id) + '] ' : '') + message);
      }
    }
  }
}

util.inherits(LogHandler, EventEmitter);
