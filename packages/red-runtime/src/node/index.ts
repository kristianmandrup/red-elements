import {
  Context,
  INode,
  $TYPES,
  lazyInject
} from './_base'

import { IEvents } from '../';

const TYPES = $TYPES.all

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

  @lazyInject(TYPES.events) $events: IEvents

  constructor() {
    super()
  }

  setDirty(d) {
    let {
      $events,
      dirty
    } = this

    dirty = d;
    $events.emit("nodes:change", {
      dirty: dirty
    });
  }
}

