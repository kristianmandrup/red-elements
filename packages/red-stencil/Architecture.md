# Architecture

Currently we are trying to build a firm structure:

- `/pages` where the pages go (for main routes)
- `/navigation` for navigation menus
- `/components` where all the node-red specific components go

## Routing

The `index.html` configures a [stencil router](https://stenciljs.com/docs/routing)

The `main-menu` element can then be used to display a list of links to each of the different pages.

## Showcasing node-red elements

Each page can then showcase one or more node-red elements, or perhaps even link to subpages with the node-red element in different configurations.

## index.html

Currently the `index.html` is completely dead and static.
You can start playing by adding the router and the main menu to let you navigate to the showcasing pages...

However for this to work you first need to register said components in bundles in the `stencil.config.js` file...

```html
  <!--
  <red-router></red-router>
  <main-menu></main-menu>
  -->
```

Good luck :)
