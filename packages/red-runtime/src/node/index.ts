import {
  Context
} from '../context'

export interface INodeDef {
  defaults: Object,
  credentials?: Object,
  category?: string,
  _?: any
  set?: any
}

export interface INode {
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
  _def?: INodeDef,
  x?: number,
  y?: number,
  z?: string, // used for subflow ID compare, so must be a string
  dirty?: boolean,
  i?: number
}

/**
 * A single Node definition
 */
export class Node extends Context implements INode {
  public id: string
  public node_defs = {};
  public nodes = [];
  public configNodes = {};
  public links = [];
  public defaultWorkspace;
  public workspaces = {};
  public workspacesOrder = [];
  public subflows = {};
  public loadedFlowVersion = null;
  public initialLoad;
  public dirty = false;

  public type: string

  constructor() {
    super()
  }

  setDirty(d) {
    let {
      RED,
      dirty
    } = this

    dirty = d;
    RED.events.emit("nodes:change", {
      dirty: dirty
    });
  }
}

