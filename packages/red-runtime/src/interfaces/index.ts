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

// TODO: move to red-interfaces to act as central hub
// avoid circular module dependencies!
export interface INotifications {
  notify(msg: any, ...args)
}

export interface IUser {
  login(options?: any): Promise<any>
}

export interface IWorkspaces {
  refresh()
}
