# Editable List

A list that is editable (you can add more list items?)
Used primarily by `NodeEditor` component (form w fields), which is used to configure a node.

## Widget definition

Does the following:

- Adds class `red-ui-editableList-list` to element
- Wraps element with `uiContainer` container `div` element
- ...

```js
(function($) {
  /**
   * options:
   *   - addButton : boolean|string - text for add label, default 'add'
   *   - height : number|'auto'
   *   - resize : function - called when list as a whole is resized
   *   - resizeItem : function(item) - called to resize individual item
   *   - sortable : boolean|string - string is the css selector for handle
   *   - sortItems : function(items) - when order of items changes
   *   - connectWith : css selector of other sortables
   *   - removable : boolean - whether to display delete button on items
   *   - addItem : function(row,index,itemData) - when an item is added
   *   - removeItem : function(itemData) - called when an item is removed
   *   - filter : function(itemData) - called for each item to determine if it should be shown
   *   - sort : function(itemDataA,itemDataB) - called to sort items
   *   - scrollOnAdd : boolean - whether to scroll to newly added items
   * methods:
   *   - addItem(itemData)
   *   - removeItem(itemData)
   *   - width(width)
   *   - height(height)
   *   - items()
   *   - empty()
   *   - filter(filter)
   *   - sort(sort)
   *   - length()
   */
    $.widget( "nodered.editableList", {
        _create: function() {
            var that = this;

            this.element.addClass('red-ui-editableList-list');
            this.uiWidth = this.element.width();
            this.uiContainer = this.element
                .wrap( "<div>" )
                .parent();

            if (this.options.header) {
              // ...
            }
        }
    })
})(jQuery);
```

### Widget usage

Here is the `diffPanel` which is an editable list:

```js
diffList = diffPanel.find("#node-dialog-view-diff-diff").editableList({
    addButton: false,
    scrollOnAdd: false,
    addItem: function(container,i,object) {
      // ... lot of garbage here!
    }
});
```
