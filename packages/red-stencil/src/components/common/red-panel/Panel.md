# PAnel

The original *node-red* Panel is a jQuery component.
We will use the jQuery component as a controller for the C.E

Instantiate the jQuery compoent with a reference to the root element of the custom element.

This implies that the jQuery widget logic takes over full control of the DOM rendered by the component.

Here is the full code:

```ts
import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-panel',
  // styleUrl: 'red-panel.scss'
})
export class RedPanel {
  constructor() {
    // registers CheckboxSet as a jQuery widget on $
    controllers.Panel({
      // specific panel opts
    })
  }

  @Prop() id: string;

  render() {
    return (
      <div id="{this.id}">
        <div class="panel first">first child</div>
        <div class="panel first">second child</div>
      </div>
    );
  }
}
```

Note that the TSX rendered by the `render` function will be replaced and controlled by the widget, and thus only acts as placeholder.

The Panel widget might require a specific HTML element layout to configure itself. You will have to look into the Panel jQuery widget code to get an idea the specific requirements (this applies for each widget on a case-by-case basis!)

Here is a sneak peak:

```js
export class Panel {
  constructor(options) {
    var container = options.container || $("#" + options.id);
    var children = container.children();

    if (children.length !== 2) {
      throw new Error("Container must have exactly two children");
    }

    container.addClass("red-ui-panels");
    var separator = $('<div class="red-ui-panels-separator"></div>').insertAfter(children[0]);
    var startPosition;
    var panelHeights = [];
    var modifiedHeights = false;
    var panelRatio;

    separator.draggable({
      // ...
    })
    // ...
  }
  // ...
}
```

We see that it expects an `options` object with an `id` as given by `$("#" + options.id)`, which selects and identifies the element to be used as container element for the widget

The container then gets added the `red-ui-panels` class.

It then does some jQuery magic:

`$('<div class="red-ui-panels-separator"></div>').insertAfter(children[0]);`

It inserts a separator `div` element after the first child of the container.
It then makes the separator `draggable`, so you can resize the panel.

For the `draggable` to work, you likely need to include a [jQuery UI draggable](https://jqueryui.com/draggable/) widget.

You will need to check the dependencies used in original *node-red* project and in *red-widgets* package in this project.

As we realize these basic assumptions and requirements, we can start to make our custom element play nice with the Panel widget API.

We start by re-writing the `render` to have a dynamic `id` on the root element, which we need to pass in as `id` to the Panel constructor.

We also add two child elements, so the Panel can insert the separator `div` in between.

```ts
  @Prop() id: string;

  render() {
    return (
      <div id="{this.id}">
        <div class="panel first">first child</div>
        <div class="panel first">second child</div>
      </div>
    );
  }
```

Futhermore, we tweak the `controllers.Panel` widget constructor.
We now pass the `id` prop as an identifier for the element to be the panel container (root element).

```ts
    new controllers.Panel({
      id: this.id
    });
```

The full code now looks as follows:

```ts
import { Component, Prop, Element } from '@stencil/core'
import { controllers } from '../controllers'
import { createjQueryWidget } from "../_util"

@Component({
  tag: 'red-panel',
  // styleUrl: 'red-panel.scss'
})
export class RedPanel {
  constructor() {
    // registers CheckboxSet as a jQuery widget on $
    controllers.Panel({
      // specific panel opts
    })
  }

  @Prop() id: string;

  render() {
    return (
      <div id="{this.id}">
        <div class="panel first">first child</div>
        <div class="panel first">second child</div>
      </div>
    );
  }
}
```
