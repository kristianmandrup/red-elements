# Search

## TypeSearch

### Status

`Tests:       6 failed, 4 passed, 10 total`

### Issues

For `createDialog()` must have a `#main-container` element available

The `src/common/controllers/searchBox` jQuery widget must have been created and made available.

```js
function factory(RED) {
  (function ($) {
    log('creating searchBox widget: nodered.searchBox', {
      $widget: $.widget
    })

    $.widget("nodered.searchBox", {
      _create: function () {
```

Then we need to make `$.widget` factory method available via jQuery UI.
We can try by adding jQuery and jQuery-UI directly from CDN hosts to html being loaded for test.

The following "hack" seems to work :)

```js
jest
  .dontMock('fs')
  .dontMock('jquery')

const $ = require('jquery');
const fs = require('fs')

global.$ = $
global.jQuery = global.$
require('jquery-ui-dist/jquery-ui')
```
