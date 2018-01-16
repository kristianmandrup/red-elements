import { IRED, TYPES, container } from '../_infra';
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(container);

export {
  IRED,
  TYPES,
  lazyInject
}

import {
  deepEquals
} from './equals'

import {
  IValidator,
  Validator
} from './validator'

export class Context {
  @lazyInject(TYPES.RED) RED: IRED;

  protected validator: IValidator
  protected ctx: IRED;
  constructor() {
    this.ctx = this.RED;
    this.validator = new Validator(this)
  }

  logWarning(msg, data?) {
    console.log(msg, data)
  }

  handleError(msg, data?) {
    this.logWarning(msg, data)
    throw new Error(msg)
  }

  setInstanceVars(instMap, target?) {
    target = target || this
    Object.keys(instMap).map(name => {
      this[name] = instMap[name]
    })
  }

  delegate(functions, target) {
    if (target === this) {
      this.handleError('cannot delegate to self', {
        target,
        $this: this
      })

      functions.map(name => {
        this[name] = target[name]
      })
    }
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

  protected _isEquivalent(a, b) {
    return deepEquals(a, b)
  }

  protected _validateArray(value, name, methodName, info?) {
    this.validator._validateArray(value, name, methodName, info)
  }

  protected _validateObj(value, name, methodName, info?) {
    this.validator._validateObj(value, name, methodName, info)
  }
  protected _validateStr(value, name, methodName, info?) {
    this.validator._validateStr(value, name, methodName, info)
  }
  protected _validateNum(value, name, methodName, info?) {
    this.validator._validateNum(value, name, methodName, info)
  }
  protected _validateJQ(obj, name, methodName, info?) {
    this.validator._validateJQ(value, name, methodName, info)
  }
  protected _validateDefined(value, name, methodName, info?) {
    this.validator._validateDefined(value, name, methodName, info)
  }
  protected _validateProps(obj, props, methodName) {
    this.validator._validateProps(obj, props, methodName)
  }
  protected _validateNodeSet(node, name, methodName, info?) {
    this.validator._validateNodeSet(node, name, methodName, info)
  }
  protected _validateEvent(ev, name, methodName, info?) {
    this.validator._validateEvent(ev, name, methodName, info)
  }
  protected _validateNode(node, name, methodName, info?) {
    this.validator._validateNode(node, name, methodName, info)
  }
  protected _validateLink(link, name, methodName, info?) {
    this.validator._validateLink(link, name, methodName, info)
  }
  protected _validateNodeDef(def, name, methodName, info?) {
    this.validator._validateNodeDef(def, name, methodName, info)
  }
  protected _validateStrOrNum(value, name, methodName, info?) {
    this.validator._validateStrOrNum(value, name, methodName, info)
  }
}
