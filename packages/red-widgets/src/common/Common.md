# Common widgets

The common widgets are the core building blocks, used by some of the higher level widgets.

There are two types of widgets:

- jQuery widgets (using [Widget Factory](https://code.tutsplus.com/tutorials/making-use-of-jquery-uis-widget-factory--net-29606))
- basic widgets (using jQuery for now to manipulate DOM)

## jQuery widgets

Each jQuery widget has a factory method of the following form:

```js
function factory(RED) {
  (function ($) {
    $.widget("nodered.checkboxSet", {
      _create: function () {
        // ...
      }
    })
  })(jQuery)
}
```

You can then register the widget in a `beforeAll` to make the widget factory method available on all jQuery elements.

```js
beforeAll(() => {
  // registers jquery UI widget via factory
  // widget factory method: checkboxSet made available on all jQuery elements
  CheckboxSet(RED)
  // ...
})
```

## basic widgets

The basic widgets typically have the following form, taking an `options` object.
In many cases it requires an `id` option which is used to identify the target element to be transformed to this "widget" type.

```js
export class Panel {
  constructor(options) {
    var container = options.container || $("#" + options.id);
    // ...
  }
}
```

Some widgets such as `Tabs` require the `RED` runtime/context object as well.
`RED` should be injected (ie. via dependency injection), NOT passed as an argument.

```js
export class Tabs extends Context {

  // TODO: use dependency injection of RED instead
  constructor(options = {}, RED) {
    super(options)
    this.options = options || {}
    this.RED = RED || options
    if (typeof options !== 'object') {
      this.handleError('Tabs must take an options object', {
        options
      })
    }
  }

  // ... more methods
}
```

Currently the constructor expect a context object (`RED`) as an argument.
We should instead use Dependency Injection of a `RED` singleton object using either:

- [InversifyJS](https://github.com/inversify/InversifyJS)
- [bottlejs](https://github.com/young-steveo/bottlejs)

Alternatively (even better), use [TypeScript](typescriptlang.org) and use a decorator to inject it.
