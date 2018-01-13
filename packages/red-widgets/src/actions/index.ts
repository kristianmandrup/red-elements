import {
  Context
} from '../context'

export class Actions extends Context {
  public actions: any = {}

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
    var RED = this.RED;
    var result = [];
    Object.keys(this.actions).forEach((action) => {
      var shortcut = RED.keyboard.getShortcut(action);
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
