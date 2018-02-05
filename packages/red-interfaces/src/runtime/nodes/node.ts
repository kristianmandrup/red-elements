import {
  INodeDef
} from './node-def'

export interface INode {
  id: string,
  name?: string,
  label?: string,
  resize?: boolean
  disabled?: boolean,
  info?: any,
  type: string,
  credentials?: any,
  ports?: any[],
  wires?: any[],
  in?: any[],
  out?: any[],
  inputs?: number,
  outputs?: number,
  inputLabels?: string[],
  outputLabels?: string[],
  _orig?: any,
  _def?: INodeDef,
  x?: number,
  y?: number,
  z?: string, // used for subflow ID compare, so must be a string
  dirty?: boolean,
  i?: number
  module?: any
  types?: any
  enabled?: boolean
  local?: boolean
  err?: Error
  context?()
}
