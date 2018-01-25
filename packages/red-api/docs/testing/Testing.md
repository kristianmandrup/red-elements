# Testing

### Running tests

The test are run from the compiled `.js` files in `/dist`.

In VSC IDE/editor, make sure you have setup build tasks for `tsconfig.json`:

- to build all `.ts` files (first time)
- to continually `watch` files for changes and compile

Use the `Tasks - Run Build Task` in the top menu.

Running:

`$ jest test/nodes/list/nodes.test.ts`

Will run the equivalent `.js` file in `/dist`

`$ jest test/nodes/list/nodes.test.ts`

You should sometimes delete the `/dist` folder to ensure you don't have left-over files from previous file name refactorings.

## Jest with TypeScript

We will be using [ts-jest](https://www.npmjs.com/package/ts-jest) to run Jest tests written in TypeScript

Please note the following Gotchas!

- [using es2015 features in javascript files](https://www.npmjs.com/package/ts-jest#using-es2015-features-in-javascript-files)
- [importing packages written in typescript](https://www.npmjs.com/package/ts-jest#importing-packages-written-in-typescript)

Make sure you use the `jest.config.js` file to configure your Jest settings.

Then just run `jest` normally and it should transpile using your settings before running.
