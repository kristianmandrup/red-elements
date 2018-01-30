import { Diff } from './index'

export class DiffResolver {
  constructor(public diff: Diff) {
  }

  resolveDiffs(localDiff, remoteDiff) {
    var conflicted = {};
    var resolutions = {};

    var diff = {
      localDiff: localDiff,
      remoteDiff: remoteDiff,
      conflicts: conflicted,
      resolutions: resolutions
    }
    var seen = {};
    var id, node;
    for (id in localDiff.currentConfig.all) {
      if (localDiff.currentConfig.all.hasOwnProperty(id)) {
        seen[id] = true;
        var localNode = localDiff.newConfig.all[id];
        if (localDiff.changed[id] && remoteDiff.deleted[id]) {
          conflicted[id] = true;
        } else if (localDiff.deleted[id] && remoteDiff.changed[id]) {
          conflicted[id] = true;
        } else if (localDiff.changed[id] && remoteDiff.changed[id]) {
          var remoteNode = remoteDiff.newConfig.all[id];
          if (JSON.stringify(localNode) !== JSON.stringify(remoteNode)) {
            conflicted[id] = true;
          }
        }
        if (!conflicted[id]) {
          if (remoteDiff.added[id] || remoteDiff.changed[id] || remoteDiff.deleted[id]) {
            resolutions[id] = 'remote';
          } else {
            resolutions[id] = 'local';
          }
        }
      }
    }
    for (id in localDiff.added) {
      if (localDiff.added.hasOwnProperty(id)) {
        node = localDiff.newConfig.all[id];
        if (remoteDiff.deleted[node.z]) {
          conflicted[id] = true;
          // conflicted[node.z] = true;
        } else {
          resolutions[id] = 'local';
        }
      }
    }
    for (id in remoteDiff.added) {
      if (remoteDiff.added.hasOwnProperty(id)) {
        node = remoteDiff.newConfig.all[id];
        if (localDiff.deleted[node.z]) {
          conflicted[id] = true;
          // conflicted[node.z] = true;
        } else {
          resolutions[id] = 'remote';
        }
      }
    }
    // console.log(diff.resolutions);
    // console.log(conflicted);
    return diff;
  }
}
