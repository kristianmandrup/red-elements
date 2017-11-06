# Red UI specs

Node-red UI using Custom Elements (possibly wrapped for Vue 2+)

This project contains packages for the (main) components used in the [node-red](nodered.org/) [editor](https://github.com/node-red/node-red/tree/master/editor), originally extracted and partly refactored in [red-editor](https://github.com/tecla5/red-editor).

We aim to repackage the original editor components as native Custom Elements, which can be used and reused across any platform or framework.

We will primarily be using StencilJS, so that it works nicely with Ionic 4 (coming very soon), which wil deliver a full cross-platform experience, using the native web standards as the platform, including Cordoba, PWA, Electron etc.

## TODO

First make each of the original Node-red Editor components into Custom Elements (ie. Web Components) so that they can be re-used across any framework or web context, and are not constrained to a particular framework.

Then wrap the custom elements as Vue components and build up a Vue app, composed from these Vue components.

## components

The components should go in `src/components`
The components structure should mirror the structure in `red-widgets`.
