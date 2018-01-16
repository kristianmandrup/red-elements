export interface IFlow {

}

export interface ILink {
  source: any,
  target: any,
  sourcePort?: any
}

import {
  INodeDef,
  INode
} from '../node'

export {
  INode,
  INodeDef
}

export {
  INodeSet
} from '../nodes/interfaces'

export interface IWorkspace extends INode {
}

export interface ISubflow extends INode {
}
