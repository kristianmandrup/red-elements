import { IWorkspace } from '../../../red-base/src/interfaces/index';

export {
  INode,
  INodeDef,
  INodeSet,
  IFlow,
  ILink,
  IWorkspace,
  ISubflow,
  IEvents,
  EventType,
  IEvent
} from '@tecla5/red-base'

export {
  INodes
} from '../nodes'

export {
  II18n
} from '../i18n'

export {
  ISettings
} from '../settings'

// TODO: move to red-interfaces to act as central hub
// avoid circular module dependencies!
export interface INotifications {
  notify(msg: any, ...args)
}

export interface IUser {
  login(options?: any): Promise<any>
}


export interface ITabs {
  create(config: any)
}


export interface IPanels {
  create(config: any)
}

export interface IWorkspaces {
  refresh()
  active: string
  add(ws: IWorkspace, x?: boolean)
  remove(id: string)
  show(id: string)
}


export interface INodeEditor {
  validateNode(node)
  createEditor(config: any)
}

export interface ICanvas {
  redraw(x?: true)
  state(state?: any)
}

export interface ISidebar {
  tabs: any
}

export interface IPalette {
  refresh()
}


