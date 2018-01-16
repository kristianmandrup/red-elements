# Red Elements

Node-red UI using native browser Custom Elements (aka. Web components).

The custom elements can be used stand-alone or with any modern view framework that is compatible with Custom Elements, such as Vue 2+ and Angular 2+.

## Packages

- `red-assets` (shared assets, including vendor files, stylesheets, images etc)
- `red-runtime` (in-memory runtime model)
- `red-widgets` (widgets in TypeScript)
- `red-stencil` (native custom elements via StencilJS )
- `red-vue` (vue components - wrapping custom elements?)

This project contains packages for the (main) components used in the [node-red](nodered.org/) [editor](https://github.com/node-red/node-red/tree/master/editor), originally extracted and partly refactored in [red-editor](https://github.com/tecla5/red-editor).

We aim to repackage the original editor components as native Custom Elements, which can be used and reused across any platform or framework.

We will primarily be using StencilJS, so that it works nicely with Ionic 4 (coming very soon), which wil deliver a full cross-platform experience, using the native web standards as the platform, including Cordoba, PWA, Electron etc.

One "ring" to rule them all!!!

## Packages

This [lerna](https://lernajs.io/) project contains the following packages:

- `red-runtime` shared assets, styles and utility scripts
- `red-stencil` stencil app with stencil custom elements (native browser elements)
- `red-vue` Vue components, wrapping custom elements
- `red-widgets` original jQuery elements/widgets from node red

### components/elements

- `red-ui-app` Full application
- `red-ui-canvas` Canvas for flows drawing, using [D3](https://d3js.org/)
- `red-ui-common` Common UI base components used as building blocks
- `red-ui-header` Header (top bar)
- `red-ui-library` Manage libraries of flows
- `red-ui-node-diff` Node difference visualizer
- `red-ui-node-editor` Node editor, form with fields for node properties
- `red-ui-main-container` Main container, containing palette, canvas, sidebar, workspaces
- `red-ui-palette` Palette of available nodes to be used on canvas
- `red-ui-search` Search for matching nodes
- `red-ui-settings` User settings management
- `red-runtime` Various shared assets
- `red-ui-sidebar` Sidebar with tabs for extra info and management
- `red-ui-tray` Slide-over modal tray panel (for Node Editor etc.)
- `red-ui-workspaces` Manage workspaces (ie. projects)

## Tracking development

In each project, please see and use the `Changelog.md`, `TODO.md` and `Issues.md` and `Testing.md` documents (if available) to track project status.

## Development Strategy

The goal is to wrap each of the node-red components as Custom elements.

Then the Custom elements will be used to compose higher level Vue components.
We wil then gradually remove the jQuery logic to use Vue data binding logic instead.

Components should first be configured to work as a "blank slate", simply as a div with a placeholder message for the component:

```html
<div id="sidebar">
  <h3>Sidebar</h3>
</div>
```

Then assemble the components, bottom up and assemble the top level components in the `red-ui-app` module for a full static page.

## Modern Custom Elements (ie. Web components)

The Custom Elements will be designed using either:

- [lit-html-element](https://www.npmjs.com/package/lit-html-element) by Google
- [stencilJS](https://www.youtube.com/watch?v=8qlEWp22Vpc) by Ionic team

We belive StencilJS is way more powerful and is the way forward, at least for more complex components. lit-html might still be useful for super lightweight components (hence the name)

## Using Custom elements with Vue

To use the Custom Elements with Vue, see the guide: [integrating Vue with Web components](https://alligator.io/vuejs/vue-integrate-web-components/)

For a quick guide to writing modern Custom Elements (aka. Web components), see [writing Web Components](https://alligator.io/web-components/your-first-custom-element/)  guide

We want to turn the original jquery widgets/components into Custom Elements (ie. Web Components) that are composable and reusable on the modern web.

We then aim to use these Custom elements to form Vue components that can be assembled in a Vue app.

## Development guide

Please use [git flow](https://guides.github.com/introduction/flow/) branch strategy during development.

We will manage and track development directly on github, using [ZenHub](https://www.zenhub.com/) Kanban boards with cards.

Please use a test driven approach, see the `/test` folder.

We aim to use [NightmareJS](http://www.nightmarejs.org/) (or Jest?) for End-to-End acceptance testing (ie. simulated browser user testing.

#### Vue components

- `polyfills.js` ES6 browser polyfills
- `index.js` Vue app bootstrap file (possibly)

Note: You can change the bootstrap file used via `entry` in `poi.config.js`

```js
  entry: [
    'src/polyfills.js',
    'src/index.js'
  ],
```

Same goes for the page template used, (ie. `template: path.join(__dirname, 'index.ejs')`)

- `controllers` original component logic

The controllers are self contained and control all their internal state and view updates using jQuery "magic" etc. Don't touch (too much!)

- `styles` CSS and Sass styles used by components
- `util` various small/useful utility functions
- `test` unit and/or e2e tests

## StencilJS

- [StencilJS](https://stenciljs.com/)
- [Stencil performance demo](https://stencil-fiber-demo.firebaseapp.com/) using Fiber rendering!
- [#UseThePlaform with StencilJS](https://www.youtube.com/watch?v=8qlEWp22Vpc)
- [Vue2 with Ionic4 via StencilJS](https://blog.paulhalliday.io/2017/10/04/how-to-use-vue-js-with-ionic-4/)

### Writing lit-html custom elements

For lightweight components without much logic, we can use `lit-html`.

Simply define a class that extends `LitElement` and provide a `render` method which uses html to render the template as a string literal.

```js
import { LitElement, html } from 'lit-element';

class Panel extends LitElement {
  render() {
    return html`
      <div>My panel</div>
    `
  }
}
customElements.define('red-ui-panel', Panel)
```

## Lerna project

*Red-UI* is a [lerna](https://lernajs.io/) project.
The project contains multiple related packages that can be managed as a unit.

See [Lerna Getting Started](https://lernajs.io/#getting-started) for typical development workflow.

## Lerna Dependencies

A lerna package can been configured with dependencies such as demonstrated in the `red-ui-app` package:

```txt
  "dependencies": {
    ...
    "@tecla5/red-stencil": "x",
    ...
  }
```

Lerna will link to matching local packages in `red-ui` if available. If not found locally it will resolve via npm registry.

This makes it easy to develop multiple inter-dependent packages simultaneously.

### Lerna quick update

To make lerna easier to use, each package comes with a `lerna:update` script which updates all dependencies via lerna.

From the root folder of any package (such as `/red-ui/packages/red-ui-app`):

```bash
red-ui/packages/red-ui-app $ npm run lerna:update
# lerna info ...
```

This will update and resolve all dependencies via lerna.

Note that dependencies linked locally are linked via symbolic link as if the files are present inside the host project itself.

### Scoped lerna (manual)

To update dependencies of a single project:

remove `package.json.lock`

Delete out all module dependencies in `/node_modules`

`$ lerna clean --scope @tecla5/service-faker`

Bootstrap package, by installing/linking new modules

`$ lerna bootstrap --scope @tecla5/service-faker`

This should also create a brand new `package.json.lock`

## Packages included

- `red-ui-app` full app, demonstrating all the components assembled
- `red-ui-canvas` canvas area for drawing node flows
- `red-ui-common` common UI components, used as essential building blocks for more complex UI components
- `red-ui-library` nodes library management
- `red-ui-node-diff` nodes difference visualizer
- `red-ui-node-editor` node editor, form with fields according to node properties
- `red-ui-palette` node palette
- `red-ui-search` search for nodes
- `red-ui-settings` user settings form
- `red-ui-sidebar` sidebar with multiple tabs
- `red-runtime` shared assets and logic used across multiple components
- `red-ui-tray` sliding tray panel overlay
- `red-ui-workspaces` workspaces

### Structure

Depending on the complexity of components, some might later be re-grouped to minimize the number of packages.

Some components will be refactored into multiple smaller components to make them easier to manage and work on.

## HTML templates

For the "base" HTML to be used in the components (and main app), please reference `/assets/templates` folder under `/red-runtime` package.

