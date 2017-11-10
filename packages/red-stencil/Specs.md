# Red UI specs

Node-red UI using Custom Elements (possibly wrapped for Vue 2+)

This project contains packages for the (main) components used in the [node-red](nodered.org/) [editor](https://github.com/node-red/node-red/tree/master/editor), originally extracted and partly refactored in [red-editor](https://github.com/tecla5/red-editor).

We aim to repackage the original editor components as native Custom Elements, which can be used and reused across any platform or framework.

We will primarily be using StencilJS, so that it works nicely with Ionic 4 (coming very soon), which wil deliver a full cross-platform experience, using the native web standards as the platform, including Cordoba, PWA, Electron etc.

## What TODO

First make each of the original [node-red](nodered.org/) UI/editor components into [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) using [StencilJS](https://stenciljs.com/)

Skeleton stencil components have already been created. Please look inside the `red-vue` package to get an idea and start porting the Vue components there, mainly the `<template>` elements and some minor component logic.

Some stencil learning resources:

- [Medium.com blog posts](https://medium.com/tag/stenciljs/latest)
- [Video tutorial series by Academind](https://www.youtube.com/watch?v=MqMYaT1GlWY)
- [Alligator.io blog posts](https://alligator.io/stencil/)

Wrapping the node-red jQuery based components/widgets as native Custom Elements makes it much easier to compose the app and port it for various frameworks etc.

In the end we can reuse the custom elements in a Vue app inside Vue components or in similar fashion in a React, Angular or whatever (dare I say Ionic app!)

## components

The components all go in `src/components`. The components structure should mirror the structure in `red-widgets`.

## attribute vs. property

Please see [JS: attribute vs. property](http://lucybain.com/blog/2014/attribute-vs-property/)

JS DOM objects have properties. These properties are kind of like instance variables for the particular element. As such, a property can be different types (boolean, string, etc.). Properties can be accessed using jQuery’s prop method (as seen below) and also by interacting with the object in vanilla JS.

Attributes are in the HTML itself, rather than in the DOM. They are very similar to properties, but not quite as good. When a property is available it’s recommended that you work with properties rather than attributes.

An attribute is only ever a string, no other type.
## Putting the widget in control

Please note that for now, we want to reuse as much of the existing (legacy) widget logic as possible. We will pass in the Custom Element root element `$el` to the widget controller so that it can take over full control of the renderd DOM for the custom element.

In a stencilJS component, the `$el` is decorated with `@Element` and points to the root element rendered by the `render` function.

## Example: Header

The following describes the strategy for wrapping `header` as a Custom Element:

```ts
@Component({
  tag: 'red-header',
  // styleUrl: '../_shared/header.scss'
})
export class RedHeader {
  constructor() {
  }

  // point to root element rendered
  @Element() me: HTMLElement;

  render() {
    return (
      <div class="header">
      </div>
    )
  }
}
```

### Render with props

We have started by copying the full `<template>` content from `Header.vue` and then reconfiguring the data bindings to work with TSX (Typescript JSX) syntax.

First have a look at the full skeleton `red-header.tsx` file:

```ts
// reuse Header.vue template from red-vue
// orignally extracted from node-red mustache templates!
render() {
  return (
    <div id="header" class="header">
      <span class="logo">
        <a href={this.url}>
          <img src={this.image.src} title={this.image.title}>
            <span>{this.title}</span>
            <a id="btn-login" class="btn btn-primary">{this.action.title}</a>
          </img>
        </a>
      </span>
      <ul class="header-toolbar hide">
        <li>
          <a id="btn-sidemenu" class="button" data-toggle="dropdown" href="#">
            <i class="fa fa-bars"></i>
          </a>
        </li>
      </ul>
      <div id="header-shade" class="hide"></div>
    </div>);
}
```

We end up with property refs like: `{this.image.title}`

This requires us to define interfaces and props such as:

```ts
interface Image {
  src?: string;
  title?: string
}

export class RedHeader {
  // ...
  @Prop() image: Image;
 // ...
}
```

The full `header.tsx` as a custom element:

```ts
import { Component, Prop, Element } from '@stencil/core'

interface Image {
  src?: string;
  title?: string
}

interface Action {
  title?: string
}

@Component({
  tag: 'red-header',
  // styleUrl: '../_shared/header.scss'
})
export class RedHeader {
  constructor() {
    // use Canvas as component controller
    // new controllers.Header()
  }

  // See https://medium.com/@gilfink/getting-to-know-stencil-decorators-350c13ce6d38
  @Element() me: HTMLElement;

  @Prop() url: string;
  @Prop() image: Image;
  @Prop() title: string;
  @Prop() action: Action;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="header">
        <span class="logo">
          <a href={this.url}>
            <img src={this.image.src} title={this.image.title}>
              <span>{this.title}</span>
              <a id="btn-login" class="btn btn-primary">{this.action.title}</a>
            </img>
          </a>
        </span>
        <ul class="header-toolbar hide">
          <li>
            <a id="btn-sidemenu" class="button" data-toggle="dropdown" href="#">
              <i class="fa fa-bars"></i>
            </a>
          </li>
        </ul>
        <div id="header-shade" class="hide"></div>
      </div>);
  }
}
```

## Example: common Panel

the original node-red Panel is a jQuery widget.
We will use the controller approach outlined above:

- instantiate the jQuery widget with the root element of the custom element

This will in turn mean that the jQuery widget logic takes over full control of the DOM rendered by the component.

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

## Add 3rd party dependencies

Make sure that relevant dependencies are added to package.json, such as jquery-ui for the `draggable` panel.

Stencil will be smart enough to detect ES6 `import` references that point to entries in `package.json`. It will bundle these dependencies as part of the file bundle used on the page. This is the modern approach used by [Webpack](https://webpack.github.io/) and similar bundlers.

Stencil uses a [dev-server](https://github.com/ionic-team/stencil-dev-server) to hot reload changes.

## Register components

Now register the component in the `stencil.config.js`.
Then insert the new custom element tag `<red-panel id="test-panel"/>` in the `index.html` app page.

## Add router and pages

Please add a [stencil router](https://github.com/ionic-team/stencil-router) so you can have multiple pages.

Have pages that each have different components to play with as you build and compose the components.

## To be continued

Gradually add more functionality for each widget, step-by-step.

You can comment out big parts of each widget and gradually re-introduce parts of the code, as you slowly get an understanding of the requirements/assumptions made by the code that you must fulfill.

Each widget can potentially require:

- specific options passed to constructor/factory method
- one or more 3rd party libraries such as D3, jQuery or jQuery UI etc.
- server endpoints from [red-api](https://github.com/tecla5/red-api)
- [red-runtime](https://github.com/tecla5/red-runtime) API

## Mocking external dependencies

For *red-api* dependencies, you can always mock the endpoints via [nock](https://www.npmjs.com/package/nock)

For *red-runtime* you can use mocking/stubbing libs such as [SinonJS](http://sinonjs.org/) or whatever suits you.

May the coding Gods be with you!! :)

## Document as you go

For the `library` element, we have started a `Library.md` document to document the widget/controller used and how to best use it in the Cutom Element (CE).

Please write such guides for each element wrapped, as it will help you think clearly and make it easier for other devs than the line to continue with a "head start" :)
