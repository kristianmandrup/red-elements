/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  Context
} from '../context'

import {
  IEvents,
} from '../interfaces'


const { log } = console

export class Events extends Context implements IEvents {
  public handlers: any = {}
  public lastEmitted: any

  constructor() {
    super()
  }

  /**
   * Add event handler
   * @param evt { string } event name (identifier)
   * @param func {Function} event handler function
   */
  on(evt: string, func: Function) {
    this.handlers[evt] = this.handlers[evt] || [];
    this.handlers[evt].push(func);
    return this
  }

  /**
   * Remove event handler
   * @param evt { string } event name (identifier)
   * @param func {Function} event handler function
   */
  off(evt: string, func: Function) {
    var handler = this.handlers[evt];
    if (handler) {
      for (var i = 0; i < handler.length; i++) {
        if (handler[i] === func) {
          handler.splice(i, 1);
          return;
        }
      }
    }
    return this
  }

  /**
   * Emit event
   * @param evt { string } event name (identifier)
   * @param arg { any } optional data to pass along
   */
  emit(evt: string, arg?: any) {
    var handlers = this.handlers[evt];
    if (!handlers) {
      return this
    }
    for (let handler of handlers) {
      try {
        let lastEmitted = handler(arg);
        this.lastEmitted = lastEmitted
      } catch (err) {
        this.handleError(`RED.events.emit error: [${evt}]`, {
          err
        });
      }
    }
    return this
  }
}
