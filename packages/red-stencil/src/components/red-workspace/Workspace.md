# Workspaces

## Workspace

TODO

## Footer

TODO

## Toolbar

Note: Not sure if this should be independent component. Try it and see.

In `editor/ui/subflow.js` we see some interactions with the workspace toolbar.
It also has its own styles in `workspaceToolbar.scss`

```js
    {
        // ...
        refreshToolbar(activeSubflow);

        $("#chart").css({"margin-top": "40px"});
        $("#workspace-toolbar").show();
    }
    function hideWorkspaceToolbar() {
        $("#workspace-toolbar").hide().empty();
        $("#chart").css({"margin-top": "0"});
    }
```
