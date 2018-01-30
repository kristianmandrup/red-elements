# Delegate classes

Most of the classes in their original form contain way too much logic and complexity, breaking the Single Responsibility principle.

The red-node classes are often around 1-3000 lines long, with some functions over 500 lines, almost impossible to understand, maintain etc.

In order to break away from this BAD anti-pattern, we use delegate classes to take over responsibility of key domain areas of the original widget.

Delgate classes can further be used like Services that are injected using dependency injected (f.ex via decorators), as is popular in [Angular dependency injection](https://angular.io/guide/dependency-injection) and in other modern frameworks.

We plan to use dependency injection of services (and delegate classes) using [inversifyjs](http://inversify.io/) as we currently done with RED.

The `RED` global object will in time be replaced with dependency injection of individual services and delegate classes. Having a huge application "service" object that we pass around everywhere is another HUGE ANTI PATTERN we want to avoid!

A good example of using delegate classes is the `Clipboard` widget:

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

## Dependency injection of delegate classes

We use specialized decorators and containers for dependency injection of delegate classes. The API is demonstrated in `test/_playbox/delegate-decorator.test.ts`.
An example can be seen for the `Deploy` widget:

### Create scope binding container

We first define a `container.ts`, to contain class bindings per environment.
This means we can swap which delegate class will be used, depending on the environment/scope (such as `dev`, `test`, `prod` etc.)

```js
import {
  createContainer
} from '@tecla5/red-base'

export {
  delegate,
  delegates,
} from '@tecla5/red-base'

// TODO: use widget container or merge widget level containers into higher lv widget container
export const container = createContainer({
  dev: 'development'
})
```

### Create delegate class with container binding

```js
import {
  delegate,
  container
} from './container'

@delegate({
  container,
  // key: 'Deployer' // implicit using class name
})
export class Deployer extends Context {
  protected deployApi: DeploymentsApi

  constructor(public deploy: Deploy) {
    super()
  }
  // ...
}
```

### Create delegator class with binding to delegates

Create the delegator class, using the same `container`, with a binding `map` that defines which name to lookup for each class property that is a delegate class.

Example: `deployer: Deployer` will lookup `'Deployer'` binding in the container for the environment container matching the current application scope at that time.

This makes it possible to switch delagate classes being used for different environments or scopes.

```js
import {
  delegates,
  container
} from './container'

@delegates({
  container,
  map: {
    configuration: DeployConfiguration,
    flowsSaver: FlowsSaver,
    deployer: Deployer
  }
})
export class Deploy extends Context {

  // injected services via delegates container!
  protected configuration: IDeployConfiguration
  protected flowsSaver: IFlowsSaver
  protected deployer: IDeployer

  constructor(options: any = {}) {
    super()
    this.configure(options)
  }
  // ...
}
```

### Container merging

Containers can be merged via `mergeInto` method, so that widget containers can be merged into a full widget project container and so on to form a hierarchy and full application setup in a very modular way.
