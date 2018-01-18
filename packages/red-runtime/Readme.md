# Red runtime

*Red runtime* is the node-red runtime and in-memory model, such as the internal node graph being edited, with some code shared between both client and server (backend API) applications.

This module is NOT a lerna project, as it has no local package dependencies in the `red-elements` repo.

## Getting started

```bash
$ npm install
...
```

## Design/Architecture

- `/src` contains all the source files in TypeScript
- `/test` contains the test files used to test source
- `/dist` contains the compiled `.js` files for distribution and compiled test files ie. both `/src` and `/test` files

## Src architecture

The source code is written in TypeScript.

Use the full power, including types and interfaces etc.

See more docs in the [/docs]((https://github.com/kristianmandrup/red-elements/blob/major-refactor/packages/red-runtime/docs/)) folder

## Docs

- Writing and running tests
- Coding conventions
- Design/Architecture
- RED and Fake RED
- Injectables and service injection
- Jest
- Editor setup
- Q & A
- ... and more...
