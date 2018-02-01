import { PaletteEditor } from '../'
import { NodeModuleManager } from './manager';

import {
  Context,
  container,
  delegateTarget
} from './_base'

@delegateTarget()
export class NodeModuleRefresher extends Context {
  constructor(public manager: NodeModuleManager) {
    super()
  }

  get editor() {
    return this.manager.editor
  }

  refreshNodeModule(module) {
    const {
    eventTimers
  } = this.editor
    if (!eventTimers.hasOwnProperty(module)) {
      eventTimers[module] = setTimeout(() => {
        delete eventTimers[module];
        this._refreshNodeModule(module);
      }, 100);
    }
  }

  _refreshNodeModule(module) {
    const {
    nodeEntries,
      nodeList,
      typesInUse,
      getContrastingBorder,
      loadedIndex,
      semVerCompare,
  } = this.editor

    if (!nodeEntries.hasOwnProperty(module)) {
      nodeEntries[module] = {
        info: this.RED.nodes.registry.getModule(module)
      };
      var index = [module];
      for (var s in nodeEntries[module].info.sets) {
        if (nodeEntries[module].info.sets.hasOwnProperty(s)) {
          index.push(s);
          index = index.concat(nodeEntries[module].info.sets[s].types)
        }
      }
      nodeEntries[module].index = index.join(",").toLowerCase();
      nodeList.editableList('addItem', nodeEntries[module]);
    } else {
      var moduleInfo = nodeEntries[module].info;
      var nodeEntry = nodeEntries[module].elements;
      if (nodeEntry) {
        var activeTypeCount = 0;
        var typeCount = 0;
        nodeEntries[module].totalUseCount = 0;
        nodeEntries[module].setUseCount = {};

        for (var setName in moduleInfo.sets) {
          if (moduleInfo.sets.hasOwnProperty(setName)) {
            var inUseCount = 0;
            var set = moduleInfo.sets[setName];
            var setElements = nodeEntry.sets[setName];

            if (set.enabled) {
              activeTypeCount += set.types.length;
            }
            typeCount += set.types.length;
            for (var i = 0; i < moduleInfo.sets[setName].types.length; i++) {
              var t = moduleInfo.sets[setName].types[i];
              inUseCount += (typesInUse[t] || 0);
              var swatch = setElements.swatches[t];
              if (set.enabled) {
                var def = this.RED.nodes.getType(t);
                if (def && def.color) {
                  swatch.css({
                    background: def.color
                  });
                  swatch.css({
                    border: "1px solid " + getContrastingBorder(swatch.css('backgroundColor'))
                  })

                } else {
                  swatch.css({
                    background: "#eee",
                    border: "1px dashed #999"
                  })
                }
              } else {
                swatch.css({
                  background: "#eee",
                  border: "1px dashed #999"
                })
              }
            }
            nodeEntries[module].setUseCount[setName] = inUseCount;
            nodeEntries[module].totalUseCount += inUseCount;

            if (inUseCount > 0) {
              setElements.enableButton.html(this.RED._('palette.editor.inuse'));
              setElements.enableButton.addClass('disabled');
            } else {
              setElements.enableButton.removeClass('disabled');
              if (set.enabled) {
                setElements.enableButton.html(this.RED._('palette.editor.disable'));
              } else {
                setElements.enableButton.html(this.RED._('palette.editor.enable'));
              }
            }
            setElements.setRow.toggleClass("palette-module-set-disabled", !set.enabled);
          }
        }
        var nodeCount = (activeTypeCount === typeCount) ? typeCount : activeTypeCount + " / " + typeCount;
        nodeEntry.setCount.html(this.RED._('palette.editor.nodeCount', {
          count: typeCount,
          label: nodeCount
        }));

        if (nodeEntries[module].totalUseCount > 0) {
          nodeEntry.enableButton.html(this.RED._('palette.editor.inuse'));
          nodeEntry.enableButton.addClass('disabled');
          nodeEntry.removeButton.hide();
        } else {
          nodeEntry.enableButton.removeClass('disabled');
          if (moduleInfo.local) {
            nodeEntry.removeButton.css('display', 'inline-block');
          }
          if (activeTypeCount === 0) {
            nodeEntry.enableButton.html(this.RED._('palette.editor.enableall'));
          } else {
            nodeEntry.enableButton.html(this.RED._('palette.editor.disableall'));
          }
          nodeEntry.container.toggleClass("disabled", (activeTypeCount === 0));
        }
      }
      if (moduleInfo.pending_version) {
        nodeEntry.versionSpan.html(moduleInfo.version + ' <i class="fa fa-long-arrow-right"></i> ' + moduleInfo.pending_version).appendTo(nodeEntry.metaRow)
        nodeEntry.updateButton.html(this.RED._('palette.editor.updated')).addClass('disabled').show();
      } else if (loadedIndex.hasOwnProperty(module)) {
        if (semVerCompare(loadedIndex[module].version, moduleInfo.version) === 1) {
          nodeEntry.updateButton.show();
          nodeEntry.updateButton.html(this.RED._('palette.editor.update', {
            version: loadedIndex[module].version
          }));
        } else {
          nodeEntry.updateButton.hide();
        }
      } else {
        nodeEntry.updateButton.hide();
      }
    }
  }
}
