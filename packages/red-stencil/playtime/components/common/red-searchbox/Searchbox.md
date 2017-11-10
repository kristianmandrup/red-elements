# Searchbox

Insights & observations about Searchbox widget...

## Searchbox widget

The original search box:

- Adds a `div` around as `uiContainer`
- Adds `red-ui-searchBox-container` style class to `uiContainer`
- Adds `fa fa-search` search icon
- ...

```js
(function($) {

    $.widget( "nodered.searchBox", {
        _create: function() {
            var that = this;

            this.currentTimeout = null;
            this.lastSent = "";
            this.element.val("");
            this.uiContainer = this.element.wrap("<div>").parent();
            this.uiContainer.addClass("red-ui-searchBox-container");

            $('<i class="fa fa-search"></i>').prependTo(this.uiContainer);
        }
    }
})()
```

## Usage examples

```js
// search.js

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
            // Down
            children = searchResults.children();
```

```js
// palette.js

$("#palette-search input").searchBox({
    delay: 100,
    change: function() {
        filterChange($(this).val());
    }
})
```

```js
// keyboard.js

pane.find("input").searchBox({
    delay: 100,
    change: function() {
        var filterValue = $(this).val().trim();
        if (filterValue === "") {
            shortcutList.editableList('filter', null);
        } else {
            filterValue = filterValue.replace(/\s/g,"");
            shortcutList.editableList('filter', function(data) {
                return data.id.toLowerCase().replace(/^.*:/,"").replace("-","").indexOf(filterValue) > -1;
            })
        }
    }
});
```
