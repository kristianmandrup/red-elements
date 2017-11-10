# Stack

Insights & observations about Stack widget...

## Stack widget

[ui/common/stack.js](https://github.com/node-red/node-red/blob/master/editor/js/ui/common/stack.js)

In `tab-info.js`

```js
  var stackContainer = $("<div>",{class:"sidebar-node-info-stack"}).appendTo(content);

  sections = RED.stack.create({
      container: stackContainer
  }).hide();
```

In `editor.js` for `open` tray handler.

```js
open: function(tray, done) {
    var trayFooter = tray.find(".editor-tray-footer");
    var trayBody = tray.find('.editor-tray-body');
    trayBody.parent().css('overflow','hidden');

    var stack = RED.stack.create({
        container: trayBody,
        singleExpanded: true
    });
    var nodeProperties = stack.add({
        title: RED._("editor.nodeProperties"),
        expanded: true
    });
    nodeProperties.content.addClass("editor-tray-content");

    var portLabels = stack.add({
        title: RED._("editor.portLabels"),
        onexpand: function() {
            refreshLabelForm(this.content,node);
        }
    });
```

## Stack and tray

In node-red, we find it used in `tray.js` like this:

```js
var editorStack = $("#editor-stack");

function showTray(options) {
    var el = $('<div class="editor-tray"></div>');
    // add various elements to el to build the tray

    // add tray to editorStack
    el.appendTo(editorStack);
}
```
