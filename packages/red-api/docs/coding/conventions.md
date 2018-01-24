# Coding conventions

Since we are porting the code from an ongoing project that is not using classes (and thus limited use of `this` reference), we want to avoid it as well to make porting of future code easier. We therefore use:

- de-structuring
- `rebind`
- `setInstanceVars`

Typical example we are striving for:

```js
addNode(node: INode) {
  // destructuring, rebind etc

  // PORTED CODE

  // setInstanceVars
  // return this (for chainable API)
}

## De-structuring

For instance vars we simply reference

```js
const {
  nodes,
  activeNodes
} = this
```

## setInstanceVars

For instance vars we want to update we use `let` then use `setInstanceVars` to update the instance vars when done updating (preferably at the end of the function)

```js
let {
  nodes,
  activeNodes
} = this

nodes = calculateNodes()
// ...

// when done updating state
this.setInstanceVars({
  nodes,
  activeNodes
})
```

## Use of rebind (functions only)

The `rebind` method should be used whenever you reference *functions* that require context, such as any class method which references variables or functions outside of it.

```js
const {
  addNode,
  removeNode
} = this.rebind([
  'addNode',
  'removeNode'
])
```

With explicit `this` context binding to `nodes` variable (example `FlowManager`)

```js
const {
  addNode,
  removeNode
} = this.rebind([
  'addNode',
  'removeNode'
], this.nodes)
```