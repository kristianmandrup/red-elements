import {
  Context
} from '../../../context'

import { DiffPanel } from './'

export interface INodeConflict {
  /**
     * create Node Conflict RadioBoxes
     * @param node
     * @param row
     * @param localDiv
     * @param remoteDiv
     * @param propertiesTable
     * @param hide
     * @param state
     */
  createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)

  /**
   * refresh conflict header
   */
  refreshConflictHeader()
}

/**
 *
 */
export class NodeConflict extends Context implements INodeConflict {
  constructor(public diffPanel: DiffPanel) {
    super()
  }

  get diff() {
    return this.diffPanel.diff
  }

  /**
   * create Node Conflict RadioBoxes
   * @param node
   * @param row
   * @param localDiv
   * @param remoteDiv
   * @param propertiesTable
   * @param hide
   * @param state
   */
  createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state) {
    let {
      value
    } = this.diff

    var safeNodeId = "node-diff-selectbox-" + node.id.replace(/\./g, '-') + (propertiesTable ? "-props" : "");
    var className = "";
    if (node.z || propertiesTable) {
      className = "node-diff-selectbox-tab-" + (propertiesTable ? node.id : node.z).replace(/\./g, '-');
    }
    var titleRow = !propertiesTable && (node.type === 'tab' || node.type === 'subflow');
    var changeHandler = (evt) => {
      var className;
      if (node.type === undefined) {
        // TODO: handle globals
      } else if (titleRow) {
        className = "node-diff-selectbox-tab-" + node.id.replace(/\./g, '-');
        $("." + className + "-" + value).prop('checked', true);
        if (value === 'local') {
          $("." + className + "-" + value).closest(".node-diff-node-entry").addClass("node-diff-select-local");
          $("." + className + "-" + value).closest(".node-diff-node-entry").removeClass("node-diff-select-remote");
        } else {
          $("." + className + "-" + value).closest(".node-diff-node-entry").removeClass("node-diff-select-local");
          $("." + className + "-" + value).closest(".node-diff-node-entry").addClass("node-diff-select-remote");
        }
      } else {
        // Individual node or properties table
        var parentId = "node-diff-selectbox-" + (propertiesTable ? node.id : node.z).replace(/\./g, '-');
        $('#' + parentId + "-local").prop('checked', false);
        $('#' + parentId + "-remote").prop('checked', false);
        var titleRowDiv = $('#' + parentId + "-local").closest(".node-diff-tab").find(".node-diff-tab-title");
        titleRowDiv.removeClass("node-diff-select-local");
        titleRowDiv.removeClass("node-diff-select-remote");
      }
      if (value === 'local') {
        row.removeClass("node-diff-select-remote");
        row.addClass("node-diff-select-local");
      } else if (value === 'remote') {
        row.addClass("node-diff-select-remote");
        row.removeClass("node-diff-select-local");
      }
      this.refreshConflictHeader();
    }

    var localSelectDiv = $('<label>', {
      class: "node-diff-selectbox",
      for: safeNodeId + "-local"
    }).click((e) => {
      e.stopPropagation();
    }).appendTo(localDiv);
    var localRadio = $('<input>', {
      id: safeNodeId + "-local",
      type: 'radio',
      value: "local",
      name: safeNodeId,
      class: className + "-local" + (titleRow ? "" : " node-diff-select-node")
    }).data('node-id', node.id).change(changeHandler).appendTo(localSelectDiv);
    var remoteSelectDiv = $('<label>', {
      class: "node-diff-selectbox",
      for: safeNodeId + "-remote"
    }).click((e) => {
      e.stopPropagation();
    }).appendTo(remoteDiv);
    var remoteRadio = $('<input>', {
      id: safeNodeId + "-remote",
      type: 'radio',
      value: "remote",
      name: safeNodeId,
      class: className + "-remote" + (titleRow ? "" : " node-diff-select-node")
    }).data('node-id', node.id).change(changeHandler).appendTo(remoteSelectDiv);
    if (state === 'local') {
      localRadio.prop('checked', true);
    } else if (state === 'remote') {
      remoteRadio.prop('checked', true);
    }
    if (hide || localDiv.hasClass("node-diff-empty") || remoteDiv.hasClass("node-diff-empty")) {
      localSelectDiv.hide();
      remoteSelectDiv.hide();
    }
  }

  /**
   * refresh conflict header
   */
  refreshConflictHeader() {
    let {
      currentDiff
    } = this.diff

    var resolutionCount = 0;
    $(".node-diff-selectbox>input:checked").each(() => {
      if (currentDiff.conflicts[$(this).data('node-id')]) {
        resolutionCount++;
      }
      currentDiff.resolutions[$(this).data('node-id')] = $(this).val();
    })
    var conflictCount = Object.keys(currentDiff.conflicts).length;
    if (conflictCount - resolutionCount === 0) {
      $("#node-diff-toolbar-resolved-conflicts").html('<span class="node-diff-node-added"><span class="node-diff-status"><i class="fa fa-check"></i></span></span> ' + this.RED._("diff.unresolvedCount", {
        count: conflictCount - resolutionCount
      }));
    } else {
      $("#node-diff-toolbar-resolved-conflicts").html('<span class="node-diff-node-conflict"><span class="node-diff-status"><i class="fa fa-exclamation"></i></span></span> ' + this.RED._("diff.unresolvedCount", {
        count: conflictCount - resolutionCount
      }));
    }
    if (conflictCount === resolutionCount) {
      $("#node-diff-view-diff-merge").removeClass('disabled');
    }
  }
}
