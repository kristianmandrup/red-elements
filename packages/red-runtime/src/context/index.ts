import { IRED, TYPES, container } from '../_infra';
import getDecorators from 'inversify-inject-decorators';
const { lazyInject } = getDecorators(container);

export {
  IRED,
  TYPES,
  lazyInject
}

import * as jQuery from 'jquery';
export const $ = jQuery

import {
  deepEquals
} from './equals'

export class Context {
  @lazyInject(TYPES.RED) RED: IRED;

  protected ctx: IRED;
  constructor() {
    this.ctx = this.RED;
  }

  protected _isEquivalent(a, b) {
    return deepEquals(a, b)
  }

  protected _validateArray(value, name, methodName, info?) {
    if (!Array.isArray(value)) {
      this.handleError(`${methodName}: ${name} must be an Array`, {
        [name]: value,
        info
      })
    }
  }

  protected _validateObj(value, name, methodName, info?) {
    if (typeof value !== 'object') {
      this.handleError(`${methodName}: ${name} must be an Object`, {
        [name]: value,
        info
      })
    }
  }

  protected _validateStr(value, name, methodName, info?) {
    if (typeof value !== 'string') {
      this.handleError(`${methodName}: ${name} must be a string`, {
        [name]: value,
        info
      })
    }
  }

  protected _validateNum(value, name, methodName, info?) {
    if (typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a number`, {
        [name]: value,
        info
      })
    }
  }

  protected _validateJQ(obj, name, methodName, info?) {
    if (obj instanceof jQuery) return true
    this.handleError(`${methodName}: ${name} must be a $ (jQuery) element`, {
      [name]: obj,
      info
    })
  }

  protected _validateDefined(value, name, methodName, info?) {
    if (value !== undefined && value !== null) return true
    this.handleError(`${methodName}: ${name} must be defined`, {
      [name]: value,
      info
    })
  }

  protected _validateProps(obj, props, methodName) {
    props.map(prop => this._validateDefined(obj[prop], prop, methodName, obj))
  }

  protected _validateNodeSet(node, name, methodName, info?) {
    this._validateObj(node, name, methodName, info)
    this._validateArray(node.types, `${name}.types`, methodName)
  }

  protected _validateEvent(ev, name, methodName, info?) {
    this._validateObj(ev, name, methodName, info)
    this._validateStr(ev.t, `${name}.t`, methodName, info)
    if (ev.t === 'multi') {
      this._validateArray(ev.events, `${name}.events`, methodName, info)
    }
    if (ev.t === 'move') {
      this._validateArray(ev.nodes, `${name}.nodes`, methodName, info)
    }
    if (ev.t === 'edit') {
      this._validateObj(ev.changes, `${name}.changes`, methodName, info)
      this._validateObj(ev.node, `${name}.node`, methodName, info)
    }

    this._validateObj(ev.changed, `${name}.changed`, methodName, info)
  }

  protected _validateNode(node, name, methodName, info?) {
    this._validateObj(node, name, methodName, info)
    // this._validateStr(node.id, `${name}.id`, methodName)
    this._validateStr(node.type, `${name}.type`, methodName)

    // this._validateObj(node.in, `${name}.in`, methodName)
    // this._validateObj(node.out, `${name}.out`, methodName)
    // this._validateNodeDef(node._def, `${name}._def`, methodName)
  }

  // TODO: add more guards/checks
  protected _validateLink(node, name, methodName, info?) {
    this._validateObj(node, name, methodName, info)
  }

  protected _validateNodeDef(def, name, methodName, info?) {
    this._validateDefined(def, name, methodName, info)
    this._validateObj(def.defaults, `${name}.defaults`, methodName, info)
    this._validateObj(def.set, `${name}.set`, methodName, info)
  }

  protected _validateStrOrNum(value, name, methodName, info?) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a string or number`, {
        [name]: value,
        info
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
