# Red UI specs

Node-red UI using Custom Elements (possibly wrapped for Vue 2+)

This project contains packages for the (main) components used in the [node-red](nodered.org/) [editor](https://github.com/node-red/node-red/tree/master/editor), originally extracted and partly refactored in [red-editor](https://github.com/tecla5/red-editor).

We aim to repackage the original editor components as native Custom Elements, which can be used and reused across any platform or framework.

We will primarily be using StencilJS, so that it works nicely with Ionic 4 (coming very soon), which wil deliver a full cross-platform experience, using the native web standards as the platform, including Cordoba, PWA, Electron etc.

## What TODO

First make each of the original [node-red](nodered.org/) UI/editor components into [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) using [StencilJS](https://stenciljs.com/)

Please see what has been done so far for `Panel` and `Header` to get an idea.
Also look at `Library.md` document (under `red-library`) to get an understanding of how to track legacy widget functionlity and convert it or use in a C.E context.

Skeleton stencil components have already been created for most widgets.

Please look inside the `red-vue` package to get an idea. Start porting the Vue components there, mainly the `<template>` elements and some minor component logic.

Start with the simple components (containers) without controller logic, such as `MainContainer`, `Header` etc. Basically any widget with no controller logic exported in `red-widgets`.

```js
  // header,
  library,
  // mainContainer,
  // nodeDiff,
  // nodeEditor,
```

## jQuery widgets

In order to succeed, you need to first have a firm grasp of jQuery and jQuery widgets API. This will allow you to understand the existing widgets and how they can be repurposed (and in time refactored) to serve in a Custom Elements context.

- [How To Use the Widget Factory](https://learn.jquery.com/jquery-ui/widget-factory/how-to-use-the-widget-factory/)
- [Widget factory](https://jqueryui.com/widget/)
- [jQuery UI widgets](https://api.jqueryui.com/category/widgets/)
- [jQuery widgets tutorials](https://www.tutorialspoint.com/jquery/jquery-widgets.htm)
- [Making Use of jQuery UI's Widget Factory](https://code.tutsplus.com/tutorials/making-use-of-jquery-uis-widget-factory--net-29606)

Use `jquery-ui` distribution

- [jquery-ui-dist](https://www.npmjs.com/package/jquery-ui-dist)

### 3rd party lib dependencies

The editor has the following essential library dependencies. Might well be more.
See [red-editor](https://github.com/tecla5/red-editor/blob/master/package.json#L21) for a complete list

```json
"dependencies": {
  "normalize.css": "^7.0.0",
  "promise-polyfill": "^6.0.2",
  "d3": "^4.10.2",
  "font-awesome": "^4.7.0",
  "i18next": "^9.0.1",
  "jquery": "^3.2.1",
  "jquery-ui-dist": "^1.12.1",
  "jsonata": "^1.3.1",
  "bootstrap": "^3.3.7",
  "bootstrap-select": "^1.12.4",
  "ace-builds": "^1.2.8",
  "marked": "^0.3.6",

  // internal package deps
  "@tecla5/red-ui-header": "^0.0.0",
  "@tecla5/red-ui-main-container": "^0.0.0",

  // stencil
  "@stencil/router": "^0.0.17"
}
```

For using jQuery UI have a base file `/_shared/jquery.js`, which include in all widgets.

```js
export {
  default as jQuery
}
from 'jquery';
// import 'jquery-ui' // uses alias (see poi.config.js)
import 'jquery-ui-dist/jquery-ui.min'

// jQuery UI CSS
import 'jquery-ui-dist/jquery-ui.min.css'
import 'jquery-ui-dist/jquery-ui.structure.min.css'
import 'jquery-ui-dist/jquery-ui.theme.min.css'
```


### Stencil - getting started

Some stencil learning resources:

- [Medium.com blog posts](https://medium.com/tag/stenciljs/latest)
- [Video tutorial series by Academind](https://www.youtube.com/watch?v=MqMYaT1GlWY)
- [Alligator.io blog posts](https://alligator.io/stencil/)

Wrapping the node-red jQuery based components/widgets as native Custom Elements makes it much easier to compose the app and port it for various frameworks etc.

In the end we can reuse the custom elements in a Vue app inside Vue components or in similar fashion in a React, Angular or whatever (dare I say Ionic app!)

## shared assets

Please note that the is a `src/_shared` folder to be used for shared functionality. You could put the `_widgets.ts` file here and iny other resources that act as bridges to external logic, such as the `red-widgets` or `red-shared` package.

Note that the `red-shared` package contains a bunch of static asset files, tests and more that can be useful to include or to use as reference (such as looking at tests etc.)

## components

The components all go in `src/components`. The components structure should mirror the structure in `red-widgets`.

## attribute vs. property

Please see [JS: attribute vs. property](http://lucybain.com/blog/2014/attribute-vs-property/)

JS DOM objects have properties. These properties are kind of like instance variables for the particular element. As such, a property can be different types (boolean, string, etc.). Properties can be accessed using jQuery’s prop method (as seen below) and also by interacting with the object in vanilla JS.

Attributes are in the HTML itself, rather than in the DOM. They are very similar to properties, but not quite as good. When a property is available it’s recommended that you work with properties rather than attributes.

An attribute is only ever a string, no other type.
## Putting the widget in control

Please note that for now, we want to reuse as much of the existing (legacy) widget logic as possible. We will pass in the Custom Element root element `$el` to the widget controller so that it can take over full control of the renderd DOM for the custom element.

In a StencilJS component, the `$el` is decorated with `@Element` and points to the root element rendered by the `render` function.

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

The original node-red Panel is a jQuery widget.
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

## Lifecycle

See [component lifecycle](https://stenciljs.com/docs/component-lifecycle)

Where the Vue components used `mount`, we need to init the controller at a similar point in the lifecycle where the DOM is available for the controller to interact with!

Most likely:

```ts
  componentDidLoad() {
    console.log('The component has been rendered');
  }
```

## Render

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

  // only do this when component is fully loaded!!!
  componentDidLoad() {
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

## Main container

As a final example, we will demonstrate `MainContainer` which uses composition:
We note that the `render` method composes the rendering of itself from registered custom elements such as `<red-workspace />`. Sweet :)

```ts
export class RedMainContainer {
  @Element() me: HTMLElement;

  // reuse Header.vue template from red-vue
  render() {
    return (
      <div id="main-container" class="sidebar-closed hide">
        <red-workspace />
        <red-palette />
        <red-editor />
        <red-sidebar />
        <div id="sidebar-separator"></div>
      </div>
    );
  }
}
```

This should give you enough of an overview to continue develop the remainder of the components as Custom Elements and gradually add more functionality.

When in doubt, run the full *node-red* project (from github) and look deeper into the code there for how it is done, then transfer it here and slowly refactor as needed.

## Library dialogs

The library panel comes with multiple dialogs for:

- finding/loading a library
- saving a library

The original dialogs can be found as `.mst` mustache templates under `src/templates`

The original `.mst` template is raw HTML with a lot of ugly, unmaintainable inline styles

```html
<div id="node-dialog-library-lookup" class="hide">
    <form class="form-horizontal">
        <div class="form-row">
            <ul id="node-dialog-library-breadcrumbs" class="breadcrumb">
                <li class="active"><a href="#" data-i18n="[append]library.breadcrumb"></a></li>
            </ul>
        </div>
        <div class="form-row">
            <div style="vertical-align: top; display: inline-block; height: 100%; width: 30%; padding-right: 20px;">
                <div id="node-select-library" style="border: 1px solid #999; width: 100%; height: 100%; overflow:scroll;"><ul></ul></div>
            </div>
            <div style="vertical-align: top; display: inline-block;width: 65%; height: 100%;">
                <div style="height: 100%; width: 95%;" class="node-text-editor" id="node-select-library-text" ></div>
            </div>
        </div>
    </form>
</div>
```

In order to use it within our component, we need to convert the inline styles into nested CSS classes:

```scss
.lookup {
  .row1 {
    display: inline-block;
    height: 100%;
    padding-right: 20px;
    vertical-align: top;
    width: 30%;

    .select-lib {
      border: 1px solid #999;
      width: 100%;
      height: 100%;
      overflow: scroll;
    }
  }
  .row2 {
    vertical-align: top;
    display: inline-block;
    width: 65%;
    height: 100%;

    .node-text-editor {
      height: 100%;
      width: 95%;
    }
  }
}
```

Which makes our TSX work out and look much cleaner and prettier :)
Note that we added a `lookup` class to the container div in order to ensure the CSS styling context (just in case).

```jsx
<div id="node-dialog-library-lookup" class="lookup hide">
  <form class="form-horizontal">
    <div class="form-row">
      <ul id="node-dialog-library-breadcrumbs" class="breadcrumb">
        <li class="active"><a href="#" data-i18n="[append]library.breadcrumb"></a></li>
      </ul>
    </div>
    <div class="form-row">
      <div class="row">
        <div id="node-select-library" class="select-lib"><ul></ul></div>
      </div>
      <div class="row2">
        <div class="node-text-editor" id="node-select-library-text" ></div>
      </div>
    </div>
  </form>
</div >
```

## Save dialog

Sometimes you have to hack a bit with the attributes to make them work with JSX/TSX. The label `for` attribute is another example

```html
<div id="node-dialog-library-save" class="hide">
  <form class="form-horizontal">
    <div class="form-row">
      <label for="node-dialog-library-save-folder" data-i18n="[append]library.folder"><i class="fa fa-folder-open"></i> </label>
  ...
</div>
```

The TSX equivalent is `htmlFor`

```tsx
<div id="node-dialog-library-save" class="hide">
  <form class="form-horizontal">
    <div class="form-row">
      <label htmlFor="node-dialog-library-save-folder" data-i18n="[append]library.folder"><i class="fa fa-folder-open"></i> </label>
      ...
</div>
```

Your editor/IDE should warn you! Use Visual Studio Code (VSC) ;)

## Add 3rd party dependencies

Make sure that relevant dependencies are added to package.json, such as jquery-ui for the `draggable` panel.

Stencil will be smart enough to detect ES6 `import` references that point to entries in `package.json`. It will bundle these dependencies as part of the file bundle used on the page. This is the modern approach used by [Webpack](https://webpack.github.io/) and similar bundlers.

Stencil uses a [dev-server](https://github.com/ionic-team/stencil-dev-server) to hot reload changes.

## Register components

Now register the component in the `stencil.config.js`.
Then insert the new custom element tag `<red-panel id="test-panel"/>` in the `index.html` app page.

```js
// stencil.config.js
exports.config = {
  bundles: [{
    // add more here ...
    components: ['red-checkbox-set', 'red-editable-list']
    // potentially make more bundles (will be loaded dynamically)
    // perhaps a bundle per page
  }],
  collections: [{
    name: '@stencil/router'
  }]
};
```

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
