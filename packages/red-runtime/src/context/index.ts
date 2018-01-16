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

import {
  INodeDef,
  INode,
  ILink,
  INodeSet
} from '../interfaces'

import {
  IEvent
} from '../history/undo'

export class Context {
  @lazyInject(TYPES.RED) RED: IRED;

  protected validator: IValidator
  protected ctx: IRED;
  public logging: boolean = false
  public logLv: number = 0

  constructor() {
    this.ctx = this.RED;
    this.validator = new Validator(this)
  }

  setLogging(logging: boolean) {
    this.logging = logging
  }


  logWarning(msg: string, data?: any) {
    if (this.logging && this.logLv < 1) {
      console.log(`WARNING: ${msg}`, data)
    }
  }

  logInfo(msg: string, data?: any, methods?: string[]) {
    if (this.logging && this.logLv < 2) {
      console.log(`INFO: ${msg}`, data)
    }
  }

  handleError(msg: string, data?: any) {
    this.logWarning(msg, data)
    throw new Error(msg)
  }

  setInstanceVars(instMap, target?) {
    target = target || this
    Object.keys(instMap).map(name => {
      this[name] = instMap[name]
    })
  }

  delegate(functions: string[], target) {
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

  rebind(varNames: string[], ctx?): any {
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

  protected _validateArray(value: any[], name: string, methodName: string, info?: string) {
    this.validator._validateArray(value, name, methodName, info)
  }

  protected _validateObj(value: object, name: string, methodName: string, info?: string) {
    this.validator._validateObj(value, name, methodName, info)
  }
  protected _validateStr(value: string, name: string, methodName: string, info?: string) {
    this.validator._validateStr(value, name, methodName, info)
  }
  protected _validateNum(value: number, name: string, methodName: string, info?: string) {
    this.validator._validateNum(value, name, methodName, info)
  }

  protected _validateBool(value: boolean, name: string, methodName: string, info?: string) {
    this.validator._validateBool(value, name, methodName, info)
  }

  protected _validateJQ(obj: JQuery<HTMLElement>, name, methodName: string, info?: string) {
    this.validator._validateJQ(obj, name, methodName, info)
  }
  protected _validateDefined(value, name: string, methodName: string, info?: any) {
    this.validator._validateDefined(value, name, methodName, info)
  }
  protected _validateProps(obj: object, props: string[], methodName: string) {
    this.validator._validateProps(obj, props, methodName)
  }
  protected _validateNodeSet(node: INodeSet, name: string, methodName: string, info?: string) {
    this.validator._validateNodeSet(node, name, methodName, info)
  }
  protected _validateEvent(ev: IEvent, name: string, methodName: string, info?: string) {
    this.validator._validateEvent(ev, name, methodName, info)
  }
  protected _validateNode(node: INode, name: string, methodName: string, info?: string) {
    this.validator._validateNode(node, name, methodName, info)
  }
  protected _validateLink(link: ILink, name: string, methodName: string, info?: string) {
    this.validator._validateLink(link, name, methodName, info)
  }
  protected _validateNodeDef(def, name, methodName, info?) {
    this.validator._validateNodeDef(def, name, methodName, info)
  }
  protected _validateStrOrNum(value, name: string, methodName: string, info?: string) {
    this.validator._validateStrOrNum(value, name, methodName, info)
  }
}
