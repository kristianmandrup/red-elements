# Checkbox Set

A set of Checkboxes, similar to a multiple selection list.
Used primarily by `NodeEditor` component (form w fields), which is used to configure a node.

## Widget

Details on legacy jQuery widget...
### Widget definition

Only option used seems to be `parent` (element)

- Wraps element with span `uiElement` container
- Adds class `red-ui-checkboxSet` to container

```js
(function($) {
    $.widget( "nodered.checkboxSet", {
        _create: function() {
            var that = this;
            this.uiElement = this.element.wrap( "<span>" ).parent();
            this.uiElement.addClass("red-ui-checkboxSet");
            if (this.options.parent) {
                this.parent = this.options.parent;
                this.parent.checkboxSet('addChild',this.element);
            }
            // ...

        // more widget API functions
        }
    })
})(jQuery);
```

Note that internally, it calls `checkboxSet` on parent, with the first argument being the method to execute, such as `updateChild` and the remainder being the arguments passed to that method call.

```js
  _create: function() {
    ///
      if (this.parent) {
          this.parent.checkboxSet('updateChild',this);
      }
  },
  _destroy: function() {
      if (this.parent) {
          this.parent.checkboxSet('removeChild',this.element);
      }
  },
  addChild: function(child) {
      var that = this;
      this.children.push(child);
  },
  removeChild: function(child) {
      var index = this.children.indexOf(child);
      if (index > -1) {
          this.children.splice(index,1);
      }
  },
```

### Widget usage

```js
var headerCheckbox = $('<input type="checkbox">').appendTo(debugNodeListHeader.find("span")[1]).checkboxSet();
```

Example usage in `debug-utils.js`

```js
var muteControl = $('<input type="checkbox">').appendTo($('<span class="meta">').appendTo(row));
muteControl.checkboxSet({
    parent: headerCheckbox
});


muteControl.checkboxSet({
    parent: flowCheckboxes[node.z]
}).change(function(e) {
    filteredNodes[node.id] = !$(this).prop('checked');
    $(".debug-message-node-"+node.id.replace(/\./g,"_")).toggleClass('hide',filteredNodes[node.id]);
});
```
