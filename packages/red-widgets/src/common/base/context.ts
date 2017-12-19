import { IRED, TYPES, lazyInject } from '../../common/base'
export class BaseContext {
  @lazyInject(TYPES.RED) RED: IRED;

  protected ctx: IRED;
  constructor() {
    this.ctx = this.RED;
  }

  logWarning(msg, data?) {
    console.log(msg, data)
  }

  handleError(msg, data?) {
    this.logWarning(msg, data)
    throw new Error(msg)
  }

  setInstanceVars(instMap) {
    Object.keys(instMap).map(name => {
      this[name] = instMap[name]
    })
  }

  rebind(varNames, ctx?) {
    ctx = ctx || this
    return varNames.reduce((acc, name) => {
      ctx[name] = ctx[name].bind(ctx)
      acc[name] = ctx[name]
      return acc
    }, {})
  }
}
