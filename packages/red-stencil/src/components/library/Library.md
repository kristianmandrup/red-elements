## Library

Library detective work...

How to track down the working of existing widgets in order to rework and use them in Custom Elements ;0

## controller widget

The controller widget for library is a class called `LibraryUI` (note: feel free to rename it to `Library`. Stick with suitable conventions)

The constructor takes an `options` object with:

- `type: string` (required)
- ...

Now we check originating [node-red editor](https://github.com/tecla5/red-editor) code, to confirm what `_` is.

It turns out that `ctx._` is a reference to [i18next](https://www.npmjs.com/package/i18next)

```js
// package.json (node-red)
  "dependencies": {
     "i18next": "1.10.6",
     //...
```

The `_` shortcut used to be available on a global `RED` context object, now simply referenced as `ctx` (in slightly refactored code of *red-editor*).

```js
RED["_"] = function() {
    return i18n.t.apply(null,arguments);
}
```

The original *library* code can be found in `library.js` of the *node-red* project:

```js
function createUI(options) {
    var libraryData = {};
    var selectedLibraryItem = null;
    var libraryEditor = null;
}

// public API
module.exports = {
  init: function() {

      RED.actions.add("core:library-export",exportFlow);

      RED.events.on("view:selection-changed",function(selection) {
          if (!selection.nodes) {
              RED.menu.setDisabled("menu-item-export",true);
      / ...
  },
  create: createUI,
}
```

We can see that:

- `LibraryUI` class was made to replace the `createUi` function
- `Library` class was made to replace the `library.init` function

The main `Library` class likely uses and controls one or more `LibraryUI` instances. We see the library initializing its `ui` instance var with a `LibraryUI` instance here.

Note that `createUI(options)` receives the options we are looking to better understand...

```js
    createUI(options) {
        var libraryData = {};
        var selectedLibraryItem = null;
        var libraryEditor = null;

        // Orion editor has set/getText
        // ACE editor has set/getValue
        // normalise to set/getValue
        if (options.editor.setText) {
            // Orion doesn't like having pos passed in, so proxy the call to drop it
            options.editor.setValue = function (text, pos) {
                options.editor.setText.call(options.editor, text);
            }
        }
        if (options.editor.getText) {
            options.editor.getValue = options.editor.getText;
        }

        this.ui = new LibraryUI(options)
    }

// ...

create: createUI
```

To make it our detective work a little harder, we see that `createUI` is exposed publicly simply as `create`. So we likely have to look for sth like `library.create` to find where it is instantiated!

We find it used in one of the build in node templates `80-function.html`

```js
RED.library.create({
    url:"functions", // where to get the data from
    type:"function", // the type of object the library is for
    editor:this.editor, // the field name the main text body goes to
    mode:"ace/mode/javascript",
    fields:['name','outputs']
});
```

Now we know how to pass some valid arguments which should init it correctly for display and operation :)

```ts

export class LibraryUI {
    constructor(options) {
        $('#node-input-name').css("width", "66%").after(
            '<div class="btn-group" style="margin-left: 5px;">' +
            '<a id="node-input-' + options.type + '-lookup" class="editor-button" data-toggle="dropdown"><i class="fa fa-book"></i> <i class="fa fa-caret-down"></i></a>' +
            '<ul class="dropdown-menu pull-right" role="menu">' +
            '<li><a id="node-input-' + options.type + '-menu-open-library" tabindex="-1" href="#">' + ctx._("library.openLibrary") + '</a></li>' +
            '<li><a id="node-input-' + options.type + '-menu-save-library" tabindex="-1" href="#">' + ctx._("library.saveToLibrary") + '</a></li>' +
            '</ul></div>'
        );
```

We can instead import `i18n` to use as `_` directly.

```ts
import i18n from 'i18n'
// same as: function _(...args) => { i18n.t.apply(null, ...args) }
const _ = i18n.t

export class LibraryUI {
    constructor(options) {
      /// ... lookup translation in 18n by key
      _("library.saveToLibrary") +
```

The use of jQuery `after` with a huge chunk of html is uggly as hell and should eventually be re-factored using a modern reactive templating approach. First things first, however. We start by reusing the original logic as much as possible with only minor changes to limit the potential for breaking things too early!

### Configuring onClick handlers

A click handler to trigger `Open` is configured for `$('#node-input-' + options.type + '-menu-open-library')`

```ts
        $('#node-input-' + options.type + '-menu-open-library').click(function (e) {
            $("#node-select-library").children().remove();
            var bc = $("#node-dialog-library-breadcrumbs");
            bc.children().first().nextAll().remove();
            libraryEditor.setValue('', -1);

            $.getJSON("library/" + options.url, function (data) {
                $("#node-select-library").append(buildFileList("/", data));
                $("#node-dialog-library-breadcrumbs a").click(function (e) {
                    $(this).parent().nextAll().remove();
                    $("#node-select-library").children().first().replaceWith(buildFileList("/", data));
                    e.stopPropagation();
                });
                $("#node-dialog-library-lookup").dialog("open");
            });

            e.preventDefault();
        });
```

## Save library onClick

A click handler to trigger `Save` is configured for: `'#node-input-' + options.type + '-menu-save-library'`

```ts
    $('#node-input-' + options.type + '-menu-save-library').click(function (e) {
      // ...
    }
```
