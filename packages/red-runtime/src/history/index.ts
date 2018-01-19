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

import Stack from 'tiny-stack'

import {
  IEvent,
  Undo,
  IUndo,
} from './undo'

import {
  Context
} from '../context'

export {
  Undo,
  IUndo
}

export interface IHistory {
  // TODO: this function is a placeholder
  // until there is a 'save' event that can be listened to
  markAllDirty()

  list()
  depth()
  push(ev: IEvent)
  pop()
  peek()
  undo()
}

export class History extends Context implements IHistory {
  protected _stack = new Stack()
  protected _undo: IUndo = new Undo()

  constructor() {
    super()
  }

  //TODO: this function is a placeholder until there is a 'save' event that can be listened to
  markAllDirty() {
    this._stack.map(ev => ev.dirty = true)
    return this
  }

  list() {
    return this._stack
  }

  depth() {
    return this._stack.length;
  }

  /**
   *
   * @param ev
   */
  push(ev: IEvent) {
    this._stack.push(ev);
    return this
  }

  /**
   * Pop top event from stack
   * Execute event
   * Return self for more chaining
   */
  undo() {
    const ev: IEvent = this._stack.pop();
    this._undo.undoEvent(ev)
    return this
  }

  /**
   * Pop top event from stack
   */
  pop() {
    return this._stack.pop();
  }

  /**
   * Peek at top event from stack
   */
  peek() {
    return this._stack.peek()
  }
}
