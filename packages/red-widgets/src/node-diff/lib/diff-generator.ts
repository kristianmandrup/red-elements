import { Diff } from './index'


export class DiffGenerator {
  constructor(public diff: Diff) {

  }



  generateDiff(currentNodes, newNodes) {
    var currentConfig = this.diff.parseNodes(currentNodes);
    var newConfig = this.diff.parseNodes(newNodes);
    var added = {};
    var deleted = {};
    var changed = {};
    var moved = {};

    const {
      RED,
      rebind
    } = this.diff

    Object.keys(currentConfig.all).forEach((id) => {
      var node = RED.nodes.workspace(id) || RED.nodes.subflow(id) || RED.nodes.node(id);
      if (!newConfig.all.hasOwnProperty(id)) {
        deleted[id] = true;
      } else if (JSON.stringify(currentConfig.all[id]) !== JSON.stringify(newConfig.all[id])) {
        changed[id] = true;

        if (currentConfig.all[id].z !== newConfig.all[id].z) {
          moved[id] = true;
        }
      }
    });
    Object.keys(newConfig.all).forEach((id) => {
      if (!currentConfig.all.hasOwnProperty(id)) {
        added[id] = true;
      }
    });

    return {
      currentConfig: currentConfig,
      newConfig: newConfig,
      added: added,
      deleted: deleted,
      changed: changed,
      moved: moved
    }
  }

}
