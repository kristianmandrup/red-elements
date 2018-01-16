import * as jQuery from 'jquery';
export const $ = jQuery

import {
  INodeDef,
  INode,
  ILink,
  INodeSet
} from '../interfaces'

import {
  IEvent
} from '../history/undo'

export interface IValidator {
  handleError(msg: string, data?: any)
  _validateArray(value: any[], name: string, methodName: string, info?: string)
  _validateObj(value: object, name: string, methodName: string, info?: string)
  _validateStr(value: string, name: string, methodName: string, info?: string)
  _validateNum(value: number, name: string, methodName: string, info?: string)
  _validateJQ(obj: JQuery<HTMLElement>, name, methodName: string, info?: string)
  _validateDefined(value, name: string, methodName: string, info?: any)
  _validateProps(obj: object, props: string[], methodName: string)
  _validateNodeSet(node: INodeSet, name: string, methodName: string, info?: string)
  _validateEvent(ev: IEvent, name: string, methodName: string, info?: string)
  _validateNode(node: INode, name: string, methodName: string, info?: string)
  _validateLink(link: ILink, name: string, methodName: string, info?: string)
  _validateNodeDef(def: INodeDef, name: string, methodName: string, info?: string)
  _validateStrOrNum(value, name: string, methodName: string, info?: string)
}

export class Validator {
  protected className: string

  constructor(public target: any) {
    this.className = this.constructor.name
  }

  handleError(msg: string, data?: any) {
    this.target.handleError(`[${this.className}] ${msg}`, data)
  }

  _validateArray(value: any[], name: string, methodName: string, info?: string) {
    if (!Array.isArray(value)) {
      this.handleError(`${methodName}: ${name} must be an Array`, {
        [name]: value,
        info
      })
    }
  }

  _validateObj(value: object, name: string, methodName: string, info?: string) {
    if (typeof value !== 'object') {
      this.handleError(`${methodName}: ${name} must be an Object`, {
        [name]: value,
        info
      })
    }
  }

  _validateStr(value: string, name: string, methodName: string, info?: string) {
    if (typeof value !== 'string') {
      this.handleError(`${methodName}: ${name} must be a string`, {
        [name]: value,
        info
      })
    }
  }

  _validateNum(value: number, name: string, methodName: string, info?: string) {
    if (typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a number`, {
        [name]: value,
        info
      })
    }
  }

  _validateBool(value: boolean, name: string, methodName: string, info?: string) {
    if (typeof value !== 'boolean') {
      this.handleError(`${methodName}: ${name} must be a boolean`, {
        [name]: value,
        info
      })
    }
  }

  _validateJQ(obj: JQuery<HTMLElement>, name, methodName: string, info?: string) {
    if (obj instanceof jQuery) return true
    this.handleError(`${methodName}: ${name} must be a $ (jQuery) element`, {
      [name]: obj,
      info
    })
  }

  _validateDefined(value, name: string, methodName: string, info?: any) {
    if (value !== undefined && value !== null) return true
    this.handleError(`${methodName}: ${name} must be defined`, {
      [name]: value,
      info
    })
  }

  _validateProps(obj: object, props: string[], methodName: string) {
    props.map(prop => this._validateDefined(obj[prop], prop, methodName, obj))
  }

  _validateNodeSet(node: INodeSet, name: string, methodName: string, info?: string) {
    this._validateObj(node, name, methodName, info)
    this._validateArray(node.types, `${name}.types`, methodName)
  }

  _validateEvent(ev: IEvent, name: string, methodName: string, info?: string) {
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

    this._validateBool(ev.changed, `${name}.changed`, methodName, info)
  }

  _validateNode(node: INode, name: string, methodName: string, info?: string) {
    this._validateObj(node, name, methodName, info)
    // this._validateStr(node.id, `${name}.id`, methodName)
    this._validateStr(node.type, `${name}.type`, methodName)

    // this._validateObj(node.in, `${name}.in`, methodName)
    // this._validateObj(node.out, `${name}.out`, methodName)
    // this._validateNodeDef(node._def, `${name}._def`, methodName)
  }

  // TODO: add more guards/checks
  _validateLink(link: ILink, name: string, methodName: string, info?: string) {
    this._validateObj(link, name, methodName, info)
  }

  _validateNodeDef(def: INodeDef, name: string, methodName: string, info?: string) {
    this._validateDefined(def, name, methodName, info)
    this._validateObj(def.defaults, `${name}.defaults`, methodName, info)
    this._validateObj(def.set, `${name}.set`, methodName, info)
  }

  _validateStrOrNum(value, name: string, methodName: string, info?: string) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a string or number`, {
        [name]: value,
        info
      })
    }
  }
}



