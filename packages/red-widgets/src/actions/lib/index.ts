import {
  Context
} from '../../context'

import {
  lazyInject,
  $TYPES
} from './container'

import { IKeyboard } from '../../keyboard';

export interface IActions {
  count: number
  add(name, handler)
  remove(name)
  get(name)
  invoke(name)
  list()
}

const TYPES = $TYPES.all

export class Actions extends Context {
  public actions: any = {}

  @lazyInject(TYPES.keyboard) $keyboard: IKeyboard

  constructor() {
    super()
  }

  get count() {
    return Object.keys(this.actions).length
  }

  add(name, handler) {
    this.actions[name] = handler;
  }

  remove(name) {
    delete this.actions[name];
  }

  get(name) {
    return this.actions[name];
  }

  invoke(name) {
    if (this.actions.hasOwnProperty(name)) {
      return this.actions[name]();
    }
  }

  list() {
    const {
      $keyboard
    } = this
    var result = [];
    Object.keys(this.actions).forEach((action) => {
      var shortcut = $keyboard.getShortcut(action);
      result.push({
        id: action,
        scope: shortcut ? shortcut.scope : undefined,
        key: shortcut ? shortcut.key : undefined,
        user: shortcut ? shortcut.user : undefined
      })
    })
    return result;
  }
}
