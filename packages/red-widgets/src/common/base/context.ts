import { IRED, TYPES, container } from '../../setup/setup';
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(container);

export {
  IRED,
  TYPES,
  lazyInject
}

export class BaseContext {
  @lazyInject(TYPES.RED) RED: IRED;

  protected ctx: IRED;
  constructor() {
    this.ctx = this.RED;
  }

  protected validateArray(value, name, methodName) {
    if (!Array.isArray(value)) {
      this.handleError(`${methodName}: ${name} must be an Array`, {
        [name]: value
      })
    }
  }

  protected validateObj(value, name, methodName) {
    if (typeof value !== 'object') {
      this.handleError(`${methodName}: ${name} must be an Object`, {
        [name]: value
      })
    }
  }

  protected validateStr(value, name, methodName) {
    if (typeof value !== 'string') {
      this.handleError(`${methodName}: ${name} must be a string`, {
        [name]: value
      })
    }
  }

  protected validateJQ(obj, name, methodName) {
    if (obj instanceof jQuery) return true
    this.handleError(`${methodName}: ${name} must be a $ (jQuery) element`, {
      [name]: obj
    })
  }

  protected validateNodeDef(node, name, methodName) {
    this.validateObj(node, name, methodName)
    this.validateObj(node._def, `${name}._def`, methodName)
    this.validateObj(node._def, `${name}._def`, methodName)
    this.validateObj(node.in, `${name}.in`, methodName)
    this.validateObj(node.out, `${name}.out`, methodName)
  }

  protected validateStrOrNum(value, name, methodName) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a string or number`, {
        [name]: value
      })
    }
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
