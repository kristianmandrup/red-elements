import {
  Context,
  INode
} from './_base'

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
  public module?: any

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

