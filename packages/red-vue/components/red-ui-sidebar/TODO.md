# TODO: Sidebar

## Issues: ._ i18n translator

Usage `title: RED._("sidebar.info.node")`

This is a i18n lookup to find the text for a particular key.

See `i18n.js` in init/constructor function.

```js
RED["_"] = () => {
    return i18n.t.apply(null,arguments);
}
```

This now seems to more or less work, but we get this error:

```bash
Cannot read property 'translator' of null
    at t (i18next.js:309)
    at i18n.init (i18n.js:65)
```
