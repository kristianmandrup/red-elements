import {
  Context
} from '../../../context'
import { Clipboard } from '../../';
import { lazyInject, $TYPES } from '../container';
import { II18n } from '../../../../../red-runtime/src/index';
import { ISettings } from '../../../../../red-runtime/src/settings/index';
import { ICanvas } from '../../../canvas/index';
import { INodes } from '../../../../../red-runtime/src/nodes/list/interface';
import { IWorkspaces } from '../../../../../red-runtime/src/interfaces/index';

interface IButton extends JQuery<HTMLElement> {
  button: Function
}

const TYPES = $TYPES.all

export class ClipboardNodesExporter extends Context {
  disabled: boolean

  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.view) $view: ICanvas
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.workspaces) $workspaces: IWorkspaces

  constructor(protected clipboard: Clipboard) {
    super()
    this.exportNodes(clipboard)
  }

  exportNodes(clipboard: Clipboard) {
    const {
      $i18n,
      $settings,
      $view,
      $nodes,
      $workspaces
    } = this
    const {
      disabled,
      dialog,
      dialogContainer,
      exportNodesDialog,
    } = this.clipboard

    if (disabled) {
      return;
    }

    //const clipboard = this
    clipboard.validateDialogContainer()

    dialogContainer.empty();
    dialogContainer.append($(exportNodesDialog));
    dialogContainer.i18n();
    let format = $settings.get('flowFilePretty') ? "export-format-full" : "export-format-mini";

    const formatGroup = $("#export-format-group > a")
    formatGroup.click(function (evt) {
      evt.preventDefault();
      if (formatGroup.hasClass('disabled') || formatGroup.hasClass('selected')) {
        $("#clipboard-export").focus();
        return;
      }
      formatGroup.parent().children().removeClass('selected');
      formatGroup.addClass('selected');

      var flow = <string>$("#clipboard-export").val();
      if (flow.length > 0) {
        var nodes = JSON.parse(flow);

        format = formatGroup.attr('id');
        if (format === 'export-format-full') {
          flow = JSON.stringify(nodes, null, 4);
        } else {
          flow = JSON.stringify(nodes);
        }
        $("#clipboard-export").val(flow);
        $("#clipboard-export").focus();
      }
    });

    const exportRangeGroupLink = $("#export-range-group > a")
    exportRangeGroupLink.click(function (evt) {
      evt.preventDefault();
      if ($(this).hasClass('disabled') || $(this).hasClass('selected')) {
        $("#clipboard-export").focus();
        return;
      }
      $(this).parent().children().removeClass('selected');
      $(this).addClass('selected');
      var type = $(this).attr('id');
      var flow = "";
      var nodes = null;

      //const { clipboard } = this.clipboard
      if (type === 'export-range-selected') {
        var selection = $view.selection();
        // clipboard._validateObj(selection, 'selection', 'exportNodes', 'exportRangeGroupLink.click')
        // clipboard._validateObj(nodes, '$nodes', 'exportNodes')

        // Don't include the subflow meta-port nodes in the exported selection
        nodes = $nodes.createExportableNodeSet(selection.nodes.filter(function (n) {
          return n.type !== 'subflow'
        }));
      } else if (type === 'export-range-flow') {
        var activeWorkspace: string = $workspaces.active;
        // clipboard._validateObj(activeWorkspace, 'activeWorkspace', 'exportNodes')

        nodes = $nodes.filterNodes({
          z: activeWorkspace
        });
        // TODO: FIX
        var parentNode = $nodes.workspace(activeWorkspace) || $nodes.subflow(activeWorkspace);
        nodes.unshift(parentNode);
        nodes = $nodes.createExportableNodeSet(nodes);
      } else if (type === 'export-range-full') {
        nodes = $nodes.createCompleteNodeSet(false);
      }
      if (nodes !== null) {
        if (format === "export-format-full") {
          flow = JSON.stringify(nodes, null, 4);
        } else {
          flow = JSON.stringify(nodes);
        }
      }
      if (flow.length > 0) {
        $("#export-copy").removeClass('disabled');
      } else {
        $("#export-copy").addClass('disabled');
      }
      $("#clipboard-export").val(flow);
      $("#clipboard-export").focus();
    })

    $("#clipboard-dialog-ok").hide();
    $("#clipboard-dialog-cancel").hide();
    $("#clipboard-dialog-copy").hide();
    $("#clipboard-dialog-close").hide();
    var selection = $view.selection();
    this._validateObj(selection, 'selection', 'exportNodes')

    const { nodes } = selection
    if (nodes) {
      $("#export-range-selected").click();
    } else {
      $("#export-range-selected").addClass('disabled').removeClass('selected');
      $("#export-range-flow").click();
    }
    if (format === "export-format-full") {
      $("#export-format-full").click();
    } else {
      $("#export-format-mini").click();
    }
    $("#clipboard-export")
      .focus(function () {
        var textarea = $(this);
        textarea.select();
        textarea.mouseup(function () {
          textarea.unbind("mouseup");
          return false;
        })
      });
    dialog.dialog("option", "title", $i18n.t("clipboard.exportNodes")).dialog("open");

    $("#clipboard-export").focus();
    if (!document.queryCommandSupported("copy")) {
      $("#clipboard-dialog-cancel").hide();
      $("#clipboard-dialog-close").show();
    } else {
      $("#clipboard-dialog-cancel").show();
      $("#clipboard-dialog-copy").show();
    }
  }
}
