# Menu

Insights & observations about Menu widget...

## Menu widget

```js
RED.menu = (function() {
    // closure (ie. what stays in vegas...!!)

    var menuItems = {};

    function createMenuItem(opt) {
        var item;

        if (opt !== null && opt.id) {
            var themeSetting = RED.settings.theme("menu."+opt.id);
            if (themeSetting === false) {
                return null;
            }
        }

        // ...
    }

    return {
        init: createMenu, // to create a menu!!

        // expose operations API on menu
        setSelected: setSelected,
        isSelected: isSelected,
        toggleSelected: toggleSelected,
        setDisabled: setDisabled,
        addItem: addItem,
        removeItem: removeItem,
        setAction: setAction
    }

})() // IIEF pattern
```

### Usage examples

```js
RED.menu.init({
  id:"btn-sidemenu",
  options: menuOptions
});
```

### Menu options

The menuOptions is an array, where each element is an object of the form (interface):

```js
{
    id:"menu-item-view-menu",
    label:RED._("menu.label.view.view"),
    options:[
      // ... nested hierarchy
      {
        id:"menu-item-view-menu-io",
        label: '...'
        onselect: 'core:show-io-dialog'
      }
    ]
}
```

Only the leaf menu nodes should have `onselect` defined.

### Full menu configuration

Here is the full `menuOptions` used by *node-red*.
Butt ugly code! Needs refactoring :O

```js
function loadEditor() {
  var menuOptions = [];
  menuOptions.push({
    id:"menu-item-view-menu",
    label:RED._("menu.label.view.view"),
    options:[
      // {id:"menu-item-view-show-grid",setting:"view-show-grid",label:RED._("menu.label.view.showGrid"),toggle:true,onselect:"core:toggle-show-grid"},
      // {id:"menu-item-view-snap-grid",setting:"view-snap-grid",label:RED._("menu.label.view.snapGrid"),toggle:true,onselect:"core:toggle-snap-grid"},
      // {id:"menu-item-status",setting:"node-show-status",label:RED._("menu.label.displayStatus"),toggle:true,onselect:"core:toggle-status", selected: true},
      //null,
      // {id:"menu-item-bidi",label:RED._("menu.label.view.textDir"),options:[
      //     {id:"menu-item-bidi-default",toggle:"text-direction",label:RED._("menu.label.view.defaultDir"),selected: true, onselect:function(s) { if(s){RED.text.bidi.setTextDirection("")}}},
      //     {id:"menu-item-bidi-ltr",toggle:"text-direction",label:RED._("menu.label.view.ltr"), onselect:function(s) { if(s){RED.text.bidi.setTextDirection("ltr")}}},
      //     {id:"menu-item-bidi-rtl",toggle:"text-direction",label:RED._("menu.label.view.rtl"), onselect:function(s) { if(s){RED.text.bidi.setTextDirection("rtl")}}},
      //     {id:"menu-item-bidi-auto",toggle:"text-direction",label:RED._("menu.label.view.auto"), onselect:function(s) { if(s){RED.text.bidi.setTextDirection("auto")}}}
      // ]},
      // null,
      {id:"menu-item-sidebar",label:RED._("menu.label.sidebar.show"),toggle:true,onselect:"core:toggle-sidebar", selected: true},
      null
  ]});
  menuOptions.push(null);
  menuOptions.push({id:"menu-item-import",label:RED._("menu.label.import"),options:[
      {id:"menu-item-import-clipboard",label:RED._("menu.label.clipboard"),onselect:"core:show-import-dialog"},
      {id:"menu-item-import-library",label:RED._("menu.label.library"),options:[]}
  ]});
  menuOptions.push({id:"menu-item-export",label:RED._("menu.label.export"),disabled:true,options:[
      {id:"menu-item-export-clipboard",label:RED._("menu.label.clipboard"),disabled:true,onselect:"core:show-export-dialog"},
      {id:"menu-item-export-library",label:RED._("menu.label.library"),disabled:true,onselect:"core:library-export"}
  ]});
  menuOptions.push(null);
  menuOptions.push({id:"menu-item-search",label:RED._("menu.label.search"),onselect:"core:search"});
  menuOptions.push(null);
  menuOptions.push({id:"menu-item-config-nodes",label:RED._("menu.label.displayConfig"),onselect:"core:show-config-tab"});
  menuOptions.push({id:"menu-item-workspace",label:RED._("menu.label.flows"),options:[
      {id:"menu-item-workspace-add",label:RED._("menu.label.add"),onselect:"core:add-flow"},
      {id:"menu-item-workspace-edit",label:RED._("menu.label.rename"),onselect:"core:edit-flow"},
      {id:"menu-item-workspace-delete",label:RED._("menu.label.delete"),onselect:"core:remove-flow"}
  ]});
  menuOptions.push({id:"menu-item-subflow",label:RED._("menu.label.subflows"), options: [
      {id:"menu-item-subflow-create",label:RED._("menu.label.createSubflow"),onselect:"core:create-subflow"},
      {id:"menu-item-subflow-convert",label:RED._("menu.label.selectionToSubflow"),disabled:true,onselect:"core:convert-to-subflow"},
  ]});
  menuOptions.push(null);
  if (RED.settings.theme('palette.editable') !== false) {
      menuOptions.push({id:"menu-item-edit-palette",label:RED._("menu.label.editPalette"),onselect:"core:manage-palette"});
      menuOptions.push(null);
  }

  menuOptions.push({id:"menu-item-user-settings",label:RED._("menu.label.settings"),onselect:"core:show-user-settings"});
  menuOptions.push(null);

  menuOptions.push({id:"menu-item-keyboard-shortcuts",label:RED._("menu.label.keyboardShortcuts"),onselect:"core:show-help"});
  menuOptions.push({id:"menu-item-help",
      label: RED.settings.theme("menu.menu-item-help.label",RED._("menu.label.help")),
      href: RED.settings.theme("menu.menu-item-help.url","http://nodered.org/docs")
  });
  menuOptions.push({id:"menu-item-node-red-version", label:"v"+RED.settings.version, onselect: "core:show-about" });
}
```
