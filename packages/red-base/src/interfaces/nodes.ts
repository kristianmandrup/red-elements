
export interface INodeDef {
  defaults: Object,
  credentials?: Object,
  category?: string,
  _?: any
  set?: any,
  info?: any
}

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

export interface INodeSet {
  id: string
  name: string
  added: boolean
  module: any
  local: boolean
  types: string[]
  version: string
  pending_version: string,
  enabled: boolean
}
