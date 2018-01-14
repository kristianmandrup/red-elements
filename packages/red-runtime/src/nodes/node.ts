import {
  Context,
  $
} from '../context'

/**
 * A single Node definition
 */
export class Node extends Context {
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

