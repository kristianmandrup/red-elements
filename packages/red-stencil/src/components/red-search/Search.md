# Search

Much ado about search...

## Search widget definition

```js
RED.search = (function() {

    var disabled = false;
    var dialog = null;
    var searchInput;
    var searchResults;
    var selected = -1;
    var visible = false;

    var index = {};
    var keys = [];
    var results = [];

    // factory
    function init() {
        RED.actions.add("core:search",show);

        RED.events.on("editor:open",function() { disabled = true; });
        RED.events.on("editor:close",function() { disabled = false; });
        RED.events.on("type-search:open",function() { disabled = true; });
        RED.events.on("type-search:close",function() { disabled = false; });



        $("#header-shade").on('mousedown',hide);
        $("#editor-shade").on('mousedown',hide);
        $("#palette-shade").on('mousedown',hide);
        $("#sidebar-shade").on('mousedown',hide);
    }

    function indexNode(n) {
      // ...
    }

    function search(val) {
        searchResults.editableList('empty');
        selected = -1;
        results = [];
        if (val.length > 0) {
            val = val.toLowerCase();
        }
    }

    return {
        init: init, // factory
        show: show,
        hide: hide
    };
})()
```


## Search widget usage

Initialized in `editor/main.js`

```js
RED.search.init();
```

In `search.js` we have the search dialog hooked up, with `keydown` event handler (delay `200 ms`)

```js
function createDialog() {
    dialog = $("<div>",{id:"red-ui-search",class:"red-ui-search"}).appendTo("#main-container");
    var searchDiv = $("<div>",{class:"red-ui-search-container"}).appendTo(dialog);
    searchInput = $('<input type="text" data-i18n="[placeholder]menu.label.searchInput">').appendTo(searchDiv).searchBox({
        delay: 200,
        change: function() {
            search($(this).val());
        }
    });
    searchInput.on('keydown',function(evt) {
        var children;
        if (results.length > 0) {
            if (evt.keyCode === 40) {
              // ...
            }
        }
    })
}
```
