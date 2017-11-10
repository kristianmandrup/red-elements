# TODO

First make each of the original [node-red](nodered.org/) UI/editor components into [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) using [StencilJS](https://stenciljs.com/)

Please see what has been done so far for `Panel` and `Header` to get an idea.
Also look at the `Library.md` document (under `red-library`) to get an understanding of how to track legacy widget functionlity and convert it or use in a C.E context.

The [Specs.md]() document gives a good run-down and guide for how to convert jQuery widgets into Stencil components.

Skeleton stencil components have already been created for most (if not all?) *node-red* widgets.

Please look inside the `red-vue` package to get an idea. They have been ported from the Vue components there, mainly by transfering the `<template>` elements and the "crude" (very incomplete) component logic to instantiate the widgets/controllers.

Start with the simple components (containers) without much controller logic, such as `MainContainer`, `Header` etc. Basically any widget with no controller logic exported in `red-widgets`.

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

Resolve the `jquery-ui` issue, as described in the [Issues.md]() document.

Good luck!!!
