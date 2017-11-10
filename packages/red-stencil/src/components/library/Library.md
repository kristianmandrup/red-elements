## Library

## controller widget

The controller widget for library is a class called `LibraryUI` (note: feel free to rename it to `Library`. Stick with suitable conventions)

The constructor takes an `options` object with:

- `type: string` (required)
- ...

I believe that `ctx._` is a reference to lodash, which used to be available on a global `RED` context object, now simply referenced as `ctx`.

Note: Please check originating node-red editor code, to confirm if `_` is lodash or some other library!

```ts
import _ from 'lodash'

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

We can instead import `lodash` (or whatever lib) as `_` and use it directly.

```ts
import _ from 'lodash'

export class LibraryUI {
    constructor(options) {
      /// ...
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
