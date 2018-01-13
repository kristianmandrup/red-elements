/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context,
  $
} from '../common/base'

const { log } = console

interface IButton extends JQuery<HTMLElement> {
  button: Function
}

interface IDialog extends JQuery<HTMLElement> {
  dialog: Function
}

export class Clipboard extends Context {
  public disabled: Boolean
  public dialog: any // JQuery<HTMLElement>
  public dialogContainer: any
  public exportNodesDialog: any
  public importNodesDialog: any

  constructor() {
    super()
    let {
      ctx,
      disabled,
    } = this

    const {
      exportNodes,
      importNodes,
      hideDropTarget
    } = this.rebind([
        'exportNodes',
        'importNodes',
        'hideDropTarget'
      ])

    this.disabled = false;

    this.setupDialogs();

    $('<input type="text" id="clipboard-hidden">').appendTo("body");

    ctx.events.on("view:selection-changed", function (selection) {
      if (!selection.nodes) {
        ctx.menu.setDisabled("menu-item-export", true);
        ctx.menu.setDisabled("menu-item-export-clipboard", true);
        ctx.menu.setDisabled("menu-item-export-library", true);
      } else {
        ctx.menu.setDisabled("menu-item-export", false);
        ctx.menu.setDisabled("menu-item-export-clipboard", false);
        ctx.menu.setDisabled("menu-item-export-library", false);
      }
    });

    ctx.actions.add("core:show-export-dialog", exportNodes);
    ctx.actions.add("core:show-import-dialog", importNodes);


    ctx.events.on("editor:open", () => {
      disabled = true;
    });
    ctx.events.on("editor:close", () => {
      disabled = false;
    });
    ctx.events.on("search:open", () => {
      disabled = true;
    });
    ctx.events.on("search:close", () => {
      disabled = false;
    });
    ctx.events.on("type-search:open", () => {
      disabled = true;
    });
    ctx.events.on("type-search:close", () => {
      disabled = false;
    });

    this.disabled = disabled

    $('#chart').on("dragenter", (event) => {
      const originalEvent: any = event.originalEvent
      if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1 ||
        $.inArray("Files", originalEvent.dataTransfer.types) != -1) {
        $("#dropTarget").css({
          display: 'table'
        });
        ctx.keyboard.add("*", "escape", hideDropTarget);
      }
    });

    $('#dropTarget').on("dragover", function (event) {
      const originalEvent: any = event.originalEvent
      if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1 ||
        $.inArray("Files", originalEvent.dataTransfer.types) != -1) {
        event.preventDefault();
      }
    })
      .on("dragleave", function (event) {
        hideDropTarget();
      })
      .on("drop", function (event) {
        const originalEvent: any = event.originalEvent
        if ($.inArray("text/plain", originalEvent.dataTransfer.types) != -1) {
          var data = originalEvent.dataTransfer.getData("text/plain");
          data = data.substring(data.indexOf('['), data.lastIndexOf(']') + 1);
          ctx.view.importNodes(data);
        } else if ($.inArray("Files", originalEvent.dataTransfer.types) != -1) {
          var files = originalEvent.dataTransfer.files;
          if (files.length === 1) {
            var file = files[0];
            var reader = new FileReader();
            reader.onload = (function (theFile) {
              return function (e) {
                ctx.view.importNodes(e.target.result);
              };
            })(file);
            reader.readAsText(file);
          }
        }
        hideDropTarget();
        event.preventDefault();
      });
    return this
  }

  setupDialogs() {
    let {
      ctx,
      dialog,
      dialogContainer,
      exportNodesDialog,
      importNodesDialog
    } = this

    dialog = <IDialog>$('<div id="clipboard-dialog" class="hide node-red-dialog"><form class="dialog-form form-horizontal"></form></div>')

    dialog.appendTo("body")
      .dialog({
        modal: true,
        autoOpen: false,
        width: 500,
        resizable: false,
        buttons: [{
          id: "clipboard-dialog-cancel",
          text: ctx._("common.label.cancel"),
          click: function () {
            dialog.dialog("close");
          }
        },
        {
          id: "clipboard-dialog-close",
          class: "primary",
          text: ctx._("common.label.close"),
          click: function () {
            dialog.dialog("close");
          }
        },
        {
          id: "clipboard-dialog-copy",
          class: "primary",
          text: ctx._("clipboard.export.copy"),
          click: function () {
            $("#clipboard-export").select();
            document.execCommand("copy");
            document.getSelection().removeAllRanges();
            ctx.notify(ctx._("clipboard.nodesExported"));
            dialog.dialog("close");
          }
        },
        {
          id: "clipboard-dialog-ok",
          class: "primary",
          text: ctx._("common.label.import"),
          click: function () {
            ctx.view.importNodes($("#clipboard-import").val(), $("#import-tab > a.selected").attr('id') === 'import-tab-new');
            dialog.dialog("close");
          }
        }
        ],
        open: function (e) {
          $(this).parent().find(".ui-dialog-titlebar-close").hide();
        },
        close: function (e) { }
      });

    dialogContainer = dialog.children(".dialog-form");

    exportNodesDialog =
      '<div class="form-row">' +
      '<label style="width:auto;margin-right: 10px;" data-i18n="clipboard.export.copy"></label>' +
      '<span id="export-range-group" class="button-group">' +
      '<a id="export-range-selected" class="editor-button toggle" href="#" data-i18n="clipboard.export.selected"></a>' +
      '<a id="export-range-flow" class="editor-button toggle" href="#" data-i18n="clipboard.export.current"></a>' +
      '<a id="export-range-full" class="editor-button toggle" href="#" data-i18n="clipboard.export.all"></a>' +
      '</span>' +
      '</div>' +
      '<div class="form-row">' +
      '<textarea readonly style="resize: none; width: 100%; border-radius: 4px;font-family: monospace; font-size: 12px; background:#f3f3f3; padding-left: 0.5em; box-sizing:border-box;" id="clipboard-export" rows="5"></textarea>' +
      '</div>' +
      '<div class="form-row" style="text-align: right;">' +
      '<span id="export-format-group" class="button-group">' +
      '<a id="export-format-mini" class="editor-button editor-button-small toggle" href="#" data-i18n="clipboard.export.compact"></a>' +
      '<a id="export-format-full" class="editor-button editor-button-small toggle" href="#" data-i18n="clipboard.export.formatted"></a>' +
      '</span>' +
      '</div>';

    importNodesDialog = '<div class="form-row">' +
      '<textarea style="resize: none; width: 100%; border-radius: 0px;font-family: monospace; font-size: 12px; background:#eee; padding-left: 0.5em; box-sizing:border-box;" id="clipboard-import" rows="5" placeholder="' +
      ctx._("clipboard.pasteNodes") +
      '"></textarea>' +
      '</div>' +
      '<div class="form-row">' +
      '<label style="width:auto;margin-right: 10px;" data-i18n="clipboard.import.import"></label>' +
      '<span id="import-tab" class="button-group">' +
      '<a id="import-tab-current" class="editor-button toggle selected" href="#" data-i18n="clipboard.export.current"></a>' +
      '<a id="import-tab-new" class="editor-button toggle" href="#" data-i18n="clipboard.import.newFlow"></a>' +
      '</span>' +
      '</div>';

    this.setInstanceVars({
      dialog,
      dialogContainer,
      importNodesDialog,
      exportNodesDialog
    })
  }

  validateImport() {
    var importInput = $("#clipboard-import");
    var v = importInput.val();
    const vStr = String(v)
    v = String(vStr).substring(vStr.indexOf('['), vStr.lastIndexOf(']') + 1);
    const okButton = <IButton>$("#clipboard-dialog-ok")
    try {
      JSON.parse(v);
      importInput.removeClass("input-error");
      importInput.val(v);
      okButton.button("enable");
    } catch (err) {
      if (v !== "") {
        importInput.addClass("input-error");
      }
      okButton.button("disable");
    }
  }

  validateDialogContainer() {
    if (!this.dialogContainer) {
      this.setupDialogs()
    }
    // test if still not defined
    if (!this.dialogContainer) {
      this.handleError('importNodes: missing dialogContainer', {
        clipboard: this
      })
    }
  }

  importNodes() {
    const {
      ctx,
      disabled,
      dialog,
      dialogContainer,
    } = this

    let {
      importNodesDialog,
      validateImport
    } = this.rebind([
        'validateImport'
      ])

    if (disabled) {
      return;
    }

    this.validateDialogContainer()

    dialogContainer.empty();
    dialogContainer.append($(importNodesDialog));
    dialogContainer.i18n();

    const dialogOk = <IButton>$("#clipboard-dialog-ok")
    dialogOk.show();
    $("#clipboard-dialog-cancel").show();
    $("#clipboard-dialog-close").hide();
    $("#clipboard-dialog-copy").hide();
    dialogOk.button("disable");

    const clipBoardImport = $("#clipboard-import")
    clipBoardImport.keyup(validateImport);
    clipBoardImport.on('paste', function () {
      setTimeout(validateImport, 10)
    });

    $("#import-tab > a").click(function (evt) {
      evt.preventDefault();
      if ($(this).hasClass('disabled') || $(this).hasClass('selected')) {
        return;
      }
      $(this).parent().children().removeClass('selected');
      $(this).addClass('selected');
    });

    dialog.dialog("option", "title", ctx._("clipboard.importNodes")).dialog("open");
  }

  exportNodes() {
    const {
      ctx,
      disabled,
      dialog,
      dialogContainer,
      exportNodesDialog,
    } = this

    if (disabled) {
      return;
    }

    const clipboard = this

    this.validateDialogContainer()

    dialogContainer.empty();
    dialogContainer.append($(exportNodesDialog));
    dialogContainer.i18n();
    let format = ctx.settings.flowFilePretty ? "export-format-full" : "export-format-mini";

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

      if (type === 'export-range-selected') {
        var selection = ctx.view.selection();
        clipboard._validateObj(selection, 'selection', 'exportNodes', 'exportRangeGroupLink.click')
        clipboard._validateObj(nodes, 'ctx.nodes', 'exportNodes')

        // Don't include the subflow meta-port nodes in the exported selection
        nodes = ctx.nodes.createExportableNodeSet(selection.nodes.filter(function (n) {
          return n.type !== 'subflow'
        }));
      } else if (type === 'export-range-flow') {
        var activeWorkspace = ctx.workspaces.active();
        clipboard._validateObj(activeWorkspace, 'activeWorkspace', 'exportNodes')

        nodes = ctx.nodes.filterNodes({
          z: activeWorkspace
        });
        var parentNode = ctx.nodes.workspace(activeWorkspace) || ctx.nodes.subflow(activeWorkspace);
        nodes.unshift(parentNode);
        nodes = ctx.nodes.createExportableNodeSet(nodes);
      } else if (type === 'export-range-full') {
        nodes = ctx.nodes.createCompleteNodeSet(false);
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
    var selection = ctx.view.selection();
    clipboard._validateObj(selection, 'selection', 'exportNodes')

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
    dialog.dialog("option", "title", ctx._("clipboard.exportNodes")).dialog("open");

    $("#clipboard-export").focus();
    if (!document.queryCommandSupported("copy")) {
      $("#clipboard-dialog-cancel").hide();
      $("#clipboard-dialog-close").show();
    } else {
      $("#clipboard-dialog-cancel").show();
      $("#clipboard-dialog-copy").show();
    }
  }

  hideDropTarget() {
    const {
      ctx
    } = this
    $("#dropTarget").hide();
    ctx.keyboard.remove("escape");
  }

  copyText(value, element, msg) {
    const {
      ctx
    } = this

    var truncated = false;
    if (typeof value !== "string") {
      value = JSON.stringify(value, function (key, value) {
        if (value !== null && typeof value === 'object') {
          if (value.__encoded__ && value.hasOwnProperty('data') && value.hasOwnProperty('length')) {
            truncated = value.data.length !== value.length;
            return value.data;
          }
        }
        return value;
      });
    }
    if (truncated) {
      msg += "_truncated";
    }
    $("#clipboard-hidden").val(value).select();
    var result = document.execCommand("copy");
    if (result && element) {
      var popover = ctx.popover.create({
        target: element,
        direction: 'left',
        size: 'small',
        content: ctx._(msg)
      });

      this._validateObj(popover, 'popover', 'copyText')

      setTimeout(function () {
        popover.close();
      }, 1000);
      popover.open();
    }
    return result;
  }
}
