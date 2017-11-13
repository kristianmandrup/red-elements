# Search

## TypeSearch

For `createDialog()` must have a `#main-container` element available
The `common/searchBox` jQuery widget must have been created and made available.

```js
function factory(RED) {
  (function ($) {
    log('creating searchBox widget')

    $.widget("nodered.searchBox", {
      _create: function () {
```

`Tests:       6 failed, 4 passed, 10 total`
