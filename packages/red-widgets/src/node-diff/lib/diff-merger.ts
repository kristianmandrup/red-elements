import { Diff } from './'

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface IDiffMerger {
  mergeDiff(diff: any)
}

@delegateTarget()
export class DiffMerger extends Context implements IDiffMerger {
  constructor(public diff: Diff) {
    super()
  }

  /**
   * @params diff {} Nodes differnce
   */
  mergeDiff(diff: any) {

    var currentConfig = diff.localDiff.currentConfig;
    var localDiff = diff.localDiff;
    var remoteDiff = diff.remoteDiff;
    var conflicts = diff.conflicts;
    var resolutions = diff.resolutions;
    var id;

    for (id in conflicts) {
      if (conflicts.hasOwnProperty(id)) {
        if (!resolutions.hasOwnProperty(id)) {
          console.log(diff);
          throw new Error(`No resolution for conflict on node: ${id}`);
        }
      }
    }

    var newConfig = [];
    var node;
    var nodeChangedStates = {};
    var localChangedStates = {};
    for (id in localDiff.newConfig.all) {
      if (localDiff.newConfig.all.hasOwnProperty(id)) {
        node = this.RED.nodes.node(id);
        if (resolutions[id] === 'local') {
          if (node) {
            nodeChangedStates[id] = node.changed;
          }
          newConfig.push(localDiff.newConfig.all[id]);
        } else if (resolutions[id] === 'remote') {
          if (!remoteDiff.deleted[id] && remoteDiff.newConfig.all.hasOwnProperty(id)) {
            if (node) {
              nodeChangedStates[id] = node.changed;
            }
            localChangedStates[id] = true;
            newConfig.push(remoteDiff.newConfig.all[id]);
          }
        } else {
          console.log("Unresolved", id)
        }
      }
    }
    for (id in remoteDiff.added) {
      if (remoteDiff.added.hasOwnProperty(id)) {
        node = this.RED.nodes.node(id);
        if (node) {
          nodeChangedStates[id] = node.changed;
        }
        if (!localDiff.added.hasOwnProperty(id)) {
          localChangedStates[id] = true;
          newConfig.push(remoteDiff.newConfig.all[id]);
        }
      }
    }
    var historyEvent = {
      t: "replace",
      config: this.RED.nodes.createCompleteNodeSet(),
      changed: nodeChangedStates,
      dirty: this.RED.nodes.dirty(),
      rev: this.RED.nodes.version()
    }

    this.RED.history.push(historyEvent);

    this.RED.nodes.clear();
    var imported = this.RED.nodes.import(newConfig);
    imported[0].forEach((n) => {
      if (nodeChangedStates[n.id] || localChangedStates[n.id]) {
        n.changed = true;
      }
    })

    this.RED.nodes.version(remoteDiff.rev);

    this.RED.view.redraw(true);
    this.RED.palette.refresh();
    this.RED.workspaces.refresh();
    this.RED.sidebar.config.refresh();
  }
}
