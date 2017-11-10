# Common components

The Common components are the main building blocks used for other higher level components.

## Components

The name of a custom element must be of the form `\w+-(\w+-)*` ie, a word, then a dash, then alphanumeric. This is to avoid clashing with native elements which are all one word element.

A custom element is defined by a Javascript class and registered with a tag name, by convention the dasherized class name.

- `RedCheckBoxSet` ie. `red-checkbox-set` custom element
- `RedEditableList` ie. `red-editable-list` custom element
- ...

## TODO

Each of these components must be wrapped as a Custom Element via lit-html or StencilJS so they can be used as native HTML elements.

For now: Use the original JQuery widgets/components/elements as "controllers" to control most of the state and view logic.

## Arhitecture

Currently we link to `@tecla5/red-widgets` via a package dependency, using [Lerna](lernajs.io/) inter-package linking.

`red-widgets/index.js` exposes the following widgets for now:

```js
export const widgets = {
  canvas,
  common,
  // ...
}
```

Each widget exports a `controllers` object with one or more controllers which can be reused from a component, such as a Custom Element (fx. via StencilJS), a Vue or Angular component etc.

## Sample component wrapper

The `RedCheckboxSet` StencilJS Custom component, uses the constructor setup the controller.

We first initialize the controller so as to add it as a jQuery widget on the global `$` (or `jQuery`) object.

We can then call `createjQueryWidget` with a reference to the root DOM element of the component and the widget name.

`createjQueryWidget(this.me, 'checkboxSet')`

Inside `createjQueryWidget` we then wrap the DOM elem as a jQuery element, and then call the name of the widget factory method, with a set of init options to turn the DOM element into such a widget.

`$(rootElem)[widgetName](options)`

This generic mechanism becomes:

`$(rootElem).checkboxSet(options)`

We thus let the widget control the layout and state logic + transitions of the component, why we call it a "controller".

```js
export class RedCheckboxSet {
  constructor() {
    // RED should (ideally) be the RED runtime
    const RED = {}
    // registers CheckboxSet as a jQuery widget on $
    controllers.CheckboxSet(RED)

    // now turn this element into a CheckboxSet jQuery widget
    createjQueryWidget(this.me, 'checkboxSet');
  }
}
```

We thus use the Component wrapper only to make it easier to re-use in various contexts as a native custom HTML element.

