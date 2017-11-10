# Node diff

## Widget definition

```js
RED.diff = (function() {

    var currentDiff = {};
    var diffVisible = false;
    var diffList;

    function init() {

        // RED.actions.add("core:show-current-diff",showLocalDiff);
        RED.actions.add("core:show-remote-diff",showRemoteDiff);
        // RED.keyboard.add("*","ctrl-shift-l","core:show-current-diff");
        RED.keyboard.add("*","ctrl-shift-r","core:show-remote-diff");

    }

    function buildDiffPanel(container) {
    }

    // return init (factory) and some API methods
    return {
        init: init,
        getRemoteDiff: getRemoteDiff,
        showRemoteDiff: showRemoteDiff,
        mergeDiff: mergeDiff
    }
})()
```

## Widget usage

Create diff API in `editor/main.js`

```js
RED.diff.init();
```

Using `diff` API in `editor/deploy.js`

```js
{
    id: "node-dialog-confirm-deploy-review",
    text: RED._("deploy.confirm.button.review"),
    class: "primary disabled",
    click: function() {
        if (!$("#node-dialog-confirm-deploy-review").hasClass('disabled')) {
            RED.diff.showRemoteDiff();
            $( this ).dialog( "close" );
        }
    }
},
{
    id: "node-dialog-confirm-deploy-merge",
    text: RED._("deploy.confirm.button.merge"),
    class: "primary disabled",
    click: function() {
        RED.diff.mergeDiff(currentDiff);
        $( this ).dialog( "close" );
    }
}
```
