/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var i18n = require('./i18n');

var levels = {
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

var levelNames = {
  10: 'fatal',
  20: 'error',
  30: 'warn',
  40: 'info',
  50: 'debug',
  60: 'trace',
  98: 'audit',
  99: 'metric'
};

var logHandlers = [];

var verbose;

var metricsEnabled = false;

interface LogSettings {

}

export class LogHandler {
  logLevel: number
  metricsOn: boolean
  auditOn: boolean
  handler: Function

  // TODO: use LogSettings type
  constructor(settings?: any) {
    this.logLevel = settings ? levels[settings.level] || levels.info : levels.info;
    this.metricsOn = settings ? settings.metrics || false : false;
    this.auditOn = settings ? settings.audit || false : false;

    metricsEnabled = metricsEnabled || this.metricsOn;

    this.handler = (settings && settings.handler) ? settings.handler(settings) : consoleLogger;
    this.on('log', function (msg) {
      if (this.shouldReportMessage(msg.level)) {
        this.handler(msg);
      }
    });
  }


  shouldReportMessage(msglevel) {
    return (msglevel == METRIC && this.metricsOn) ||
      (msglevel == AUDIT && this.auditOn) ||
      msglevel <= this.logLevel;
  }

  consoleLogger(msg) {
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

export class Logger {
  FATAL: 10
  ERROR: 20
  WARN: 30
  INFO: 40
  DEBUG: 50
  TRACE: 60
  AUDIT: 98
  METRIC: 99

  constructor(settings) {
    metricsEnabled = false;
    logHandlers = [];
    var loggerSettings = {};
    verbose = settings.verbose;
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

  addHandler(func) {
    logHandlers.push(func);
  }
  removeHandler(func) {
    var index = logHandlers.indexOf(func);
    if (index > -1) {
      logHandlers.splice(index, 1);
    }
  }

  log(msg) {
    msg.timestamp = Date.now();
    logHandlers.forEach(function (handler) {
      handler.emit('log', msg);
    });
  }

  info(msg) {
    log({ level: INFO, msg: msg });
  }
  warn(msg) {
    log({ level: WARN, msg: msg });
  }
  error(msg) {
    log({ level: ERROR, msg: msg });
  }
  trace(msg) {
    log({ level: TRACE, msg: msg });
  }
  debug(msg) {
    log({ level: DEBUG, msg: msg });
  }
  metric() {
    return metricsEnabled;
  }

  audit(msg, req) {
    msg.level = AUDIT;
    if (req) {
      msg.user = req.user;
      msg.path = req.path;
      msg.ip = (req.headers && req.headers['x-forwarded-for']) || (req.connection && req.connection.remoteAddress) || undefined;
    }
    log(msg);
  }
}

