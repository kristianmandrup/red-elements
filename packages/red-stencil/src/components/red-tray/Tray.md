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
}
```
