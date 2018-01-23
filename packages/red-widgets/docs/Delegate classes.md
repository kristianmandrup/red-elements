# Delegate classes

Most of the widget classes in their original form contain way too much logic and complexity, breaking the Single Responsibility principle.

The Widget classes end up being 1-3000 lines long, with some functions over 500 lines, almost impossible to understand, maintain etc.

In order to break away from this BAD anti-pattern, we use delegate classes to take over responsibility of key domain areas of the original widget.

A good example of this is the `Clipboard` widget:

```js
export class Clipboard extends Context {
  public disabled: Boolean
  public dialog: any // JQuery<HTMLElement>
  public dialogContainer: any
  public exportNodesDialog: any
  public importNodesDialog: any

  protected configuration: ClipboardConfiguration = new ClipboardConfiguration(this)
  // more delegation classes

  constructor() {
    super()
    this.configure()
  }

  /**
   * Configure clipboard
   *
   * Uses configuration: ClipboardConfiguration delegation class
   */
  configure() {
    this.configuration.configure()
    return this
  }

  //... more instance methods
}
```

Notice how we define the property `configuration`, a delegation class instance and initialize it via `new ClipboardConfiguration(this)` passing the reference to the Clipboard instance itself, so the delegation class has access to all the properties and methods of clipboard.

```js
protected configuration: ClipboardConfiguration = new ClipboardConfiguration(this)
```


```js
export class ClipboardConfiguration extends Context {
  disabled: boolean

  constructor(protected clipboard: Clipboard) {
    super()
  }
```

In the delegate class, the constructor takes the `clipboard: Clipboard` as the only argument, thus creating a property `clipboard` which references the parent class (ie. `Clipboard`), which delegates to `ClipboardConfiguration`.

This way, the `ClipboardConfiguration` will have access to everything defined on `Clipboard` via property `clipboard` and hence any other delegate instances as well, such as `this.clipboard.nodes.exportNodes()` wheres `nodes` could be the delegate instance for `NodesAPI` which perhaps further delegates to a `NodesExporter` class. This forms a hierarchy of delegate classes, where each branch/leaf class has access to the full ancestry of parent classes delegating down to it, including the root instance, in this case `clipboard`.

The `configure` method can leverage all this to avoid using `this`, except for references to its own properties and functions. Everything else is dereferences via parent context in the hierarchy (most often just one level up).


```js
  configure() {
    // pre-bind all references (ie. vars & functions) to correct context before use
    const {
      RED,
      rebind,
      clipboard
    } = this

    let {
      disabled,
    } = this

    const {
      exportNodes,
      importNodes,
      hideDropTarget,
      setupDialogs
    } = rebind([
        'exportNodes',
        'importNodes',
        'hideDropTarget',
        'setupDialogs'
      ], clipboard)

    // now we can use pre-bound references as local vars/functions
    // ... no need to use this.xxx beyond this point!!!
    disabled = false;

    setupDialogs()

    // ... logic is now easy to move around as all refs are prebound to correct context
  }
}
```

## rebind

`rebind` must be used to rebind all functions used to the correct class instance context, such as methods in the `Clipboard` class for the `this.clipboard` instance and so on.

## delegation in action

The `configure` method of `Clipboard` now uses the `configuration` instance of  `ClipboardConfiguration`, a delegation class designed to manage and handle all configuration of the `Clipboard`.

```js
export class Clipboard extends Context {
  protected configuration: ClipboardConfiguration = new ClipboardConfiguration(this)

  constructor() {
    super()
    this.configure()
  }

  /**
   * Configure Clipboard
   */
  configure() {
    this.configuration.configure()
    return this
  }
```