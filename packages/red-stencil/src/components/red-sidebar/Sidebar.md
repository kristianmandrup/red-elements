# Sidebar

TODO

## Definition

### API

- `init` factory
- `addTab`
- `removeTab`
- `show`
- `containsTab`
- `toggleSidebar`

The sidebar initialized by creating a `sidebar-tabs` `Tabs` widget.

```js
RED.sidebar = (function() {

    //$('#sidebar').tabs();
    var sidebar_tabs = RED.tabs.create({
        id:"sidebar-tabs",
        onchange:function(tab) {
            $("#sidebar-content").children().hide();
            $("#sidebar-footer").children().hide();
            if (tab.onchange) {
                tab.onchange.call(tab);
            }
            $(tab.wrapper).show();
            if (tab.toolbar) {
                $(tab.toolbar).show();
            }
        },
        onremove: function(tab) {
            $(tab.wrapper).hide();
            if (tab.onremove) {
                tab.onremove.call(tab);
            }
        },
        minimumActiveTabWidth: 110
    });

    var knownTabs = {

    };

    function init () {
        RED.actions.add("core:toggle-sidebar",function(state){
            if (state === undefined) {
                RED.menu.toggleSelected("menu-item-sidebar");
            } else {
                toggleSidebar(state);
            }
        });
        showSidebar();
        RED.sidebar.info.init();
        RED.sidebar.config.init();
        // hide info bar at start if screen rather narrow...
        if ($(window).width() < 600) { RED.menu.setSelected("menu-item-sidebar",false); }
    }

    return {
        init: init,
        addTab: addTab,
        removeTab: removeTab,
        show: showSidebar,
        containsTab: containsTab,
        toggleSidebar: toggleSidebar,
    }
```

## Usage

Initialize in `editor/main.js`

```js
RED.sidebar.init();
```
