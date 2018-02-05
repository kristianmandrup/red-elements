import {
  ILink,
  IWorkspace,
  INode,
  ISubflow
} from '../..'

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
  events?: IEvent[],
  changed?: boolean,
  config?: object,
  rev?: string, // revision (ie. version)
  links?: ILink[],
  workspaces?: any,
  activeWorkspace?: IWorkspace,
  nodes?: INode[],
  subflow?: ISubflow,
  subflows?: any,
  removedLinks?: any[],
  subflowOutputs?: any[],
  subflowInputs?: any[],
  changes?: any[],
  node?: INode,
  outputMap?: object,
  order?: any[],
  dirty?: boolean
}
