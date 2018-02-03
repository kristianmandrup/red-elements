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


// TODO: move to red-interfaces to act as central hub
// avoid circular module dependencies!
export interface INotifications {
  notify(msg: any)
}

export interface IUser {
  login(options?: any): Promise<any>
}

export interface IWorkspaces {

}
