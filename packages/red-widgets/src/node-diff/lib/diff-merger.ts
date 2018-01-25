import { Diff } from './'

export class DiffMerger {
  constructor(public diff: Diff) {
  }

  /**
   * @params diff {} Nodes differnce
   */
  mergeDiff(diff: any) {

    const {
      RED,
    } = this.diff

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
        node = RED.nodes.node(id);
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
        node = RED.nodes.node(id);
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
      config: RED.nodes.createCompleteNodeSet(),
      changed: nodeChangedStates,
      dirty: RED.nodes.dirty(),
      rev: RED.nodes.version()
    }

    RED.history.push(historyEvent);

    RED.nodes.clear();
    var imported = RED.nodes.import(newConfig);
    imported[0].forEach((n) => {
      if (nodeChangedStates[n.id] || localChangedStates[n.id]) {
        n.changed = true;
      }
    })

    RED.nodes.version(remoteDiff.rev);

    RED.view.redraw(true);
    RED.palette.refresh();
    RED.workspaces.refresh();
    RED.sidebar.config.refresh();
  }
}
