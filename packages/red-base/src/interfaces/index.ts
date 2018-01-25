import {
  INodeDef,
  INode,
  INodeSet
} from './nodes'

export {
  INodeDef,
  INode,
  INodeSet
}

export type JQElem = JQuery<HTMLElement>

export interface IFlow {
}

export interface ILink {
  source: any,
  target: any,
  sourcePort?: any
}

export interface IWorkspace extends INode {
}

export interface ISubflow extends INode {
}

/**
 * Communication events
 */
export interface IEvents {
  handlers: any
  lastEmitted: any

  on(evt: string, func: Function)
  off(evt: string, func: Function)
  emit(evt: string, arg?: any)
}

/**
 * Editor event types (History)
 */
export type EventType =
  'multi' |
  'add' |
  'replace' |
  'delete' |
  'move' |
  'edit' |
  'createSubflow' |
  'reorder'

/**
 * Editor events (History)
 */
export interface IEvent {
  t: EventType,
  events: IEvent[],
  changed: boolean,
  config: object,
  rev: string, // revision (ie. version)
  links: ILink[],
  workspaces: any,
  activeWorkspace: IWorkspace,
  nodes: INode[],
  subflow: ISubflow,
  subflows: any,
  removedLinks: any[],
  subflowOutputs: any[],
  subflowInputs: any[],
  changes: any[],
  node: INode,
  outputMap: object,
  order: any[],
  dirty: boolean
}
