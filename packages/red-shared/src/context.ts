import { IRED, TYPES, container } from './_setup/setup';
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(container);

export {
  IRED,
  TYPES,
  lazyInject
}

export class Context {
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
      const fun = ctx[name]

      // IMPORTANT: ensure we only rebind functions
      if (typeof fun === 'function') {
        ctx[name] = fun.bind(ctx)
      }
      acc[name] = ctx[name]
      return acc
    }, {})
  }
}
