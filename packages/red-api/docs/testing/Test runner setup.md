# Test runner setup

You need `jest-cli` installed for the project.

```bash
$ npm install -g jest-cli`
// install output
```

## Run jest with debugger

See(https://github.com/kristianmandrup/red-elements/blob/major-refactor/packages/red-runtime/docs/VSC-Debug.md) for detailed description of setup

CLI command:

```bash
$ node --inspect-brk node_modules/.bin/jest --runInBand jest test/nodes/node.test.ts
// ... <<TEST output>>
```
