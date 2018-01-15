import * as jQuery from 'jquery';
export const $ = jQuery

import {
  NodeDef,
  Node,
  Link,
} from '../nodes/interfaces'

import {
  NodeSet
} from '../nodes/registry/node-set'

import {
  Event
} from '../history/undo'

export interface IValidator {
  handleError(msg: string, data?: any)
  _validateArray(value: any[], name: string, methodName: string, info?: string)
  _validateObj(value: object, name: string, methodName: string, info?: string)
  _validateStr(value: string, name: string, methodName: string, info?: string)
  _validateNum(value: number, name: string, methodName: string, info?: string)
  _validateJQ(obj: JQuery<HTMLElement>, name, methodName: string, info?: string)
  _validateDefined(value, name: string, methodName: string, info?: string)
  _validateProps(obj: object, props: string[], methodName: string)
  _validateNodeSet(node: NodeSet, name: string, methodName: string, info?: string)
  _validateEvent(ev: Event, name: string, methodName: string, info?: string)
  _validateNode(node: Node, name: string, methodName: string, info?: string)
  _validateLink(link: Link, name: string, methodName: string, info?: string)
  _validateNodeDef(def: NodeDef, name: string, methodName: string, info?: string)
  _validateStrOrNum(value, name: string, methodName: string, info?: string)
}

export class Validator {
  protected className: string

  constructor(public target: any) {
    this.className = this.constructor.name
  }

  handleError(msg, data?) {
    this.target.handleError(`[${this.className}] ${msg}`, data)
  }

  _validateArray(value, name, methodName, info?) {
    if (!Array.isArray(value)) {
      this.handleError(`${methodName}: ${name} must be an Array`, {
        [name]: value,
        info
      })
    }
  }

  _validateObj(value, name, methodName, info?) {
    if (typeof value !== 'object') {
      this.handleError(`${methodName}: ${name} must be an Object`, {
        [name]: value,
        info
      })
    }
  }

  _validateStr(value, name, methodName, info?) {
    if (typeof value !== 'string') {
      this.handleError(`${methodName}: ${name} must be a string`, {
        [name]: value,
        info
      })
    }
  }

  _validateNum(value, name, methodName, info?) {
    if (typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a number`, {
        [name]: value,
        info
      })
    }
  }

  _validateJQ(obj, name, methodName, info?) {
    if (obj instanceof jQuery) return true
    this.handleError(`${methodName}: ${name} must be a $ (jQuery) element`, {
      [name]: obj,
      info
    })
  }

  _validateDefined(value, name, methodName, info?) {
    if (value !== undefined && value !== null) return true
    this.handleError(`${methodName}: ${name} must be defined`, {
      [name]: value,
      info
    })
  }

  _validateProps(obj, props, methodName) {
    props.map(prop => this._validateDefined(obj[prop], prop, methodName, obj))
  }

  _validateNodeSet(node, name, methodName, info?) {
    this._validateObj(node, name, methodName, info)
    this._validateArray(node.types, `${name}.types`, methodName)
  }

  _validateEvent(ev, name, methodName, info?) {
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

  _validateNode(node, name, methodName, info?) {
    this._validateObj(node, name, methodName, info)
    // this._validateStr(node.id, `${name}.id`, methodName)
    this._validateStr(node.type, `${name}.type`, methodName)

    // this._validateObj(node.in, `${name}.in`, methodName)
    // this._validateObj(node.out, `${name}.out`, methodName)
    // this._validateNodeDef(node._def, `${name}._def`, methodName)
  }

  // TODO: add more guards/checks
  _validateLink(node, name, methodName, info?) {
    this._validateObj(node, name, methodName, info)
  }

  _validateNodeDef(def, name, methodName, info?) {
    this._validateDefined(def, name, methodName, info)
    this._validateObj(def.defaults, `${name}.defaults`, methodName, info)
    this._validateObj(def.set, `${name}.set`, methodName, info)
  }

  _validateStrOrNum(value, name, methodName, info?) {
    if (typeof value !== 'string' && typeof value !== 'number') {
      this.handleError(`${methodName}: ${name} must be a string or number`, {
        [name]: value,
        info
      })
    }
  }
}

