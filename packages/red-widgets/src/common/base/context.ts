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

  protected _validateObj(value, name, methodName) {
    if (typeof value !== 'object') {
      this.handleError(`${methodName}: ${name} must be an Object`, {
        [name]: value
      })
    }
  }

  protected _validateStr(value, name, methodName) {
    if (typeof value !== 'string') {
      this.handleError(`${methodName}: ${name} must be a string`, {
        [name]: value
      })
    }
  }

  protected _validateJQ(obj, name, methodName) {
    if (obj instanceof jQuery) return true
    this.handleError(`${methodName}: ${name} must be a $ (jQuery) element`, {
      [name]: obj
    })
  }

  protected _validateDefined(value, name, methodName, context?) {
    if (value !== undefined && value !== null) return true
    this.handleError(`${methodName}: ${name} must be defined`, {
      [name]: value,
      context
    })
  }

  protected _validateProps(obj, props, methodName) {
    props.map(prop => this._validateDefined(obj[prop], prop, methodName, obj))
  }

  protected _validateNode(node, name, methodName) {
    this._validateObj(node, name, methodName)
    // this._validateStr(node.id, `${name}.id`, methodName)
    this._validateStr(node.type, `${name}.type`, methodName)

    // this._validateObj(node.in, `${name}.in`, methodName)
    // this._validateObj(node.out, `${name}.out`, methodName)
    // this._validateNodeDef(node._def, `${name}._def`, methodName)
  }

  protected _validateNodeDef(def, name, methodName) {
    this._validateDefined(def, name, methodName)
    this._validateObj(def.defaults, `${name}.defaults`, methodName)
    this._validateObj(def.set, `${name}.set`, methodName)
  }

  protected _validateStrOrNum(value, name, methodName) {
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
