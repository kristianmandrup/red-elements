# Tray

Insights & observations about Tray widget...

## Adding to editor stack

In `tray.js` we build up the tray element, then add it to `editorStack`

```js
var editorStack = $("#editor-stack");

function showTray(options) {
    var el = $('<div class="editor-tray"></div>');
    // add various elements to el to build the tray

    // add tray to editorStack
    el.appendTo(editorStack);
    var tray = {
        tray: el,
        header: header,
        body: body,
        footer: footer,
        options: options,
        primaryButton: primaryButton
    };
    stack.push(tray);
}
```

In `workspaces.js`

```js
var trayOptions = {
  title: RED._("workspace.editFlow",{name:workspace.label}),
  buttons: [
      {
          id: "node-dialog-delete",
          class: 'leftButton'+((workspace_tabs.count() == 1)?" disabled":""),
          text: RED._("common.label.delete"), //'<i class="fa fa-trash"></i>',
          click: function() {
              deleteWorkspace(workspace);
              RED.tray.close();
          }
      },
      {
          id: "node-dialog-cancel",
          text: RED._("common.label.cancel"),
          click: function() {
              RED.tray.close();
          }
      },
      {
          id: "node-dialog-ok",
          class: "primary",
          text: RED._("common.label.done"),
          click: function() {
              var label = $( "#node-input-name" ).val();
              var changed = false;
              var changes = {};
              if (workspace.label != label) {
                  changes.label = workspace.label;
                  changed = true;
                  workspace.label = label;
                  workspace_tabs.renameTab(workspace.id,label);
              }
              var disabled = $("#node-input-disabled").prop("checked");
              if (workspace.disabled !== disabled) {
                  changes.disabled = workspace.disabled;
                  changed = true;
                  workspace.disabled = disabled;
              }
              var info = tabflowEditor.getValue();
              if (workspace.info !== info) {
                  changes.info = workspace.info;
                  changed = true;
                  workspace.info = info;
              }
              $("#red-ui-tab-"+(workspace.id.replace(".","-"))).toggleClass('workspace-disabled',workspace.disabled);
              // $("#workspace").toggleClass("workspace-disabled",workspace.disabled);

              if (changed) {
                  var historyEvent = {
                      t: "edit",
                      changes:changes,
                      node: workspace,
                      dirty: RED.nodes.dirty()
                  }
                  workspace.changed = true;
                  RED.history.push(historyEvent);
                  RED.nodes.dirty(true);
                  RED.sidebar.config.refresh();
                  var selection = RED.view.selection();
                  if (!selection.nodes && !selection.links) {
                      RED.sidebar.info.refresh(workspace);
                  }
              }
              RED.tray.close();
          }
      }
  ],
```

Quite something to behold! :O
