# Node editor

##

## Editor usage

Initialize object with API in `editor/main.js`

```js
RED.editor.init();
```

In `history.js`

```js
RED.editor.updateNodeProperties(n);
```

In `nodes.js`

```js
RED.editor.validateNode(node);
```

In `typedInput.js`

```js
RED.editor.editJSON({
    value: value,
    complete: function(v) {
        var value = v;
        try {
            value = JSON.stringify(JSON.parse(v));
        } catch(err) {
        }
        that.value(value);
    }
})
```

In `subflow.js`

```js
$("#workspace-subflow-edit").click(function(event) {
    RED.editor.editSubflow(RED.nodes.subflow(RED.workspaces.active()));
    event.preventDefault();
});
```

In `view.js`

```js
function editSelection() {
    if (moving_set.length > 0) {
        var node = moving_set[0].n;
        if (node.type === "subflow") {
            RED.editor.editSubflow(activeSubflow);
        } else {
            RED.editor.edit(node);
        }
    }
}
```
