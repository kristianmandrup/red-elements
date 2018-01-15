// TODO: extends Node[] ??
export interface Flow {

}

export interface Link {
  source: any,
  target: any,
  sourcePort?: any
}


export interface NodeDef {
  defaults: Object,
  credentials?: Object,
  category?: string,
  _?: any
}

// TODO: Fix - Use Node class instead!!
export interface Node {
  id: string,
  name?: string,
  info?: string,
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
  _def?: NodeDef,
  x?: number,
  y?: number,
  z?: number,
  dirty?: boolean,
  i?: number
}

export interface Workspace extends Node {
}

export interface Subflow extends Node {
}
