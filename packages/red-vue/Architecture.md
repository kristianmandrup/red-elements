# Architcture

## Build

The build and packaging is done via [Poi](https://poi.js.org/#/)
Configure the build process via `poi.config.js`, such as adding additional build plugins for [SASS](http://sass-lang.com/) etc.

## Dependency management

To update dependencies, please use [lerna](https://lernajs.io/#getting-started) via the `lerna:update` script included.

```bash
$ npm run lerna:update
# lerna info ...
```

This will update and resolve all dependencies via lerna.

See more lerna info in main [Readme](https://github.com/tecla5/red-ui/blob/master/Readme.md)

## Rendering home page

The app uses `index.ejs`  to render the home page (ie. Single Page Application) via [EJS](http://www.embeddedjs.com/) templating.

The original node-red mustache template can be found in `/templates/index.mst` for reference.

The data for the EJS template is configured in `poi.config.js` in the `html` entry.
You can change the `template` being used, set the page `title` etc.

The Vue app uses [Poi](https://poi.js.org/) asset loading (via [Webpack](https://webpack.js.org/)) to load all assets, including vendor libs, stylesheets, fonts etc.

```js
// bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-themen.min.css'
import 'bootstrap/dist/js/bootstrap.min'
```

## Composition and dependencies

The app is composed from the following main components:

- `Header` from `red-ui-header`
- `MainContainer` from `red-ui-main-container`

The `package.json` has the following dependencies:

```txt
  "dependencies": {
    ...
    "@tecla5/red-ui-header": "^0.0.0",
    "@tecla5/red-ui-main-container": "^0.0.0",
    ...
  }
```

## App

The main app should import the `api` and `runtime` and start the runtime when the app component is fully loaded and created.

```js
import api from '@tecla5/red-api'
import runtime from '@tecla5/red-runtime'

export default {
  name: 'mainContainer',
  components: {
    'red-header': Header,
    'red-main-container': MainContainer,
    // ...
  },
  created() {
    // start runtime
    runtime.main() // see main.js
  }
}
```

## Development process

Use Lerna with `lerna:update` to manage dependencies.
