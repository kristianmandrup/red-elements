import {
  Context
} from '../context'

export class Actions extends Context {
  public actions: any

  constructor(ctx) {
    super()
    this.actions = {}
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
      this.actions[name]();
    }
  }

  list() {
    var RED = this.ctx;

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
