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

## Putting the widget in control

Please note that for now, we want to reuse as much of the existing (legacy) widget logic as possible. We will pass in the Custom Element root element `$el` to the widget controller so that it can take over full control of the renderd DOM for the custom element.

In a stencilJS component, the `$el` is decorated with `@Element` and points to the root element rendered by the `render` function.
