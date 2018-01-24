# Testing

## Naive flat approach

The naive, flat testing approach is to simply use a flat `test` scope as follows.
This is useful for testing a simple function that taks no arguments or only one type of input and always does the same thing.

In this case we can only use a global `beforeEach` that applies to all tests.

WARNING: This is NOT a scalable testing approach!

```js
let nodes, flowManager
beforeEach(() => {
  nodes = create()
  flowManager = nodes.flowManager
})

test('subflowContains - matches', () => {
  let sfid = 'x'
  let nodeid = 'a'
  let subflowConfig = fakeNode({
    z: sfid,
    id: sfid,
    type: 'subflow:config'
  })
  let subflow = fakeNode({
    id: sfid,
    type: 'config'
  })

  nodes.addNode(subflowConfig)
  nodes.addSubflow(subflow)

  let found = flowManager.subflowContains(sfid, nodeid)
  expect(found).toBeTruthy()
})
```

## Grouped tests

When we are testing the same function with different inputs to cover all (or most) of its logical branches, it is better to group under a `describe`.

To avoid code/pattern duplication, we should avoid repeating the same testing code with slightly different variables. A futher optimized vrsion will be demonstrated below.

```js
describe('subflowContains', () => {

  let nodes, flowManager
  beforeEach(() => {
    nodes = create()
    flowManager = nodes.flowManager
  })

  test('matches', () => {
    let sfid = 'x'
    let nodeid = 'a'
    let subflowConfig = fakeNode({
      z: sfid,
      id: sfid,
      type: 'subflow:config'
    })
    let subflow = fakeNode({
      id: sfid,
      type: 'config'
    })

    nodes.addNode(subflowConfig)
    nodes.addSubflow(subflow)

    let found = flowManager.subflowContains(sfid, nodeid)
    expect(found).toBeTruthy()
  })

  test('no match', () => {
    let sfid = 'x'
    let nodeid = 'a'
    let subflowConfig = fakeNode({
      z: sfid,
      id: sfid,
      type: 'subflow:config'
    })
    let subflow = fakeNode({
      id: sfid,
      type: 'config'
    })

    nodes.addNode(subflowConfig)
    nodes.addSubflow(subflow)

    let found = flowManager.subflowContains(sfid, nodeid)
    expect(found).toBeFalsy()
  })
})
```

## Parameterized grouped tests

We want to avoid code/pattern duplication across tests that are similar except for input arguments and expectations.

To achieve this we can put the API testing code in a separate function that each test calls,
but with different arguments. Each test can then do different expectations on the return value.

Here we add the varying input arguments in a `$testMap` object, keyed by name of the scenario to test for those variables. This further provides documentation!

```js
  const $testMap = {
    'no match': {
      sfid: 'x',
      // ...
    },
    'matches': {
      // ...
    }
  }
```

We then add the function that performs the API test `testSubflowContains(context, name)`, which takes a test context and a name to look up in the `$testMap` variable map.

The `const $map = $testMap[name]` then retrieves the variable map to use for this test instance

```js
  function testSubflowContains(context, name) {
    let {
      $testMap,
      fakeNode,
      nodes,
    } = context

    const flowManager = nodes.flowManager
    const $map = $testMap[name]
```

The `beforeEach` of the describe then sets up a new context before each test

```js
  let context
  beforeEach(() => {
    nodes = create()

    context = {
      $testMap,
      fakeNode,
      nodes,
    }
  })
```

Each test then calls the API testing function with the context and name of var map to use, collects the result and performs expectations.

```js
  const found = testSubflowContains(context, 'matches')
  expect(found).toBeTruthy()
```

The tests are now super elegant, mainly consisting of result expectations

```js
  // Each test has much smaller footprint
  test('matches', () => {
    const found = testSubflowContains(context, 'matches')
    expect(found).toBeTruthy()
  })
```

The full picture looks as follows:

```js
describe.only('subflowContains', () => {
  const $testMap = {
    'no match': {
      sfid: 'x',
      nodeid: 'a',
      subflowType: 'unknown:config',
      type: 'config'
    },
    'matches': {
      sfid: 'y',
      nodeid: 'a',
      subflowType: 'subflow:config',
      type: 'config'
    }
  }

  function testSubflowContains(context, name) {
    let {
      $testMap,
      fakeNode,
      nodes,
    } = context

    const flowManager = nodes.flowManager
    const $map = $testMap[name]

    // TEST GOES HERE

    // Use $map
    let sfid = $map.sfid
    let nodeid = $map.nodeid
    let subflowConfig = fakeNode({
      z: sfid,
      id: sfid,
      type: $map.subflowType
    })
    let subflow = fakeNode({
      id: sfid,
      type: $map.type
    })

    nodes.addNode(subflowConfig)
    nodes.addSubflow(subflow)

    return flowManager.subflowContains(sfid, nodeid)
  }

  let context
  beforeEach(() => {
    nodes = create()

    context = {
      $testMap,
      fakeNode,
      nodes,
    }
  })

  // Each test has much smaller footprint
  test('matches', () => {
    const found = testSubflowContains(context, 'matches')
    expect(found).toBeTruthy()
  })

  test('no match', () => {
    const found = testSubflowContains(context, 'no match')
    expect(found).toBeFalsy()
  })
})
```

## Reusing parameterized grouped tests

For an even more advanced testing infrastructure, we can make the tests entirely reusable across multiple test files. See the `test/playbox` for a simple example:

For the `subflowContains` test example, it looks as follows:

```js
// load infrastructure to run reusable mapped tests
import {
  prepareTests
} from '../../_infra'

// load map of shared tests to use
import * as sharedTests from './shared-tests'

// configure map of test vars to use for each test
const $testMap = {
  'no match': {
    sfid: 'x',
    nodeid: 'a',
    subflowType: 'unknown:config',
    type: 'config'
  },
  'matches': {
    sfid: 'y',
    nodeid: 'a',
    subflowType: 'subflow:config',
    type: 'config'
  }
}

// TEST all FlowManager delegations
describe.only('Nodes:FlowManager', () => {

  // the context to build before each test
  function buildContext() {
    const nodes = createNodes()
    return {
      $testMap,
      $nodes: nodes,
      fakeNode,
      flowManager: nodes.flowManager
    }
  }
  // prepare all the tests using the shared tests and context
  prepareTests(sharedTests.flowManager, buildContext).map(t => {
    test(t.$label, t.$fun)
  })
})
```

The imported `shared-tests` then imports shared tests as follows:

```js
export {
  flowManager
} from './flow-manager'
```

The `FlowManager:subflowContains` tests look similar to the *Parameterized grouped tests* example. We have an almost identical `testSubflowContains(context, name?)` API testing function, which has the `name` argument optional.

We then export a `flowManager` const, which is a map, keyed by test name such as `subflowContains :- no match`, each key mapped to a higher order (factory) function that returns a function that is the internals of each test (as before).

```js
export const flowManager = {
  'subflowContains :- no match': (context: any = {}) => {
    // function to execute the test
    return () => {
      // ...
    }
  },
  // more key mappings
```

We here use the special separator `:-` to identify what comes after as the `$testMap` key name to use.

The full `shared-tests/flowManager.ts` file looks as follows:

```js
function testSubflowContains(context, name?) {
  const {
    $testMap,
    fakeNode,
    $nodes,
    flowManager
  } = context

  const $map = $testMap[context.$label || name]

  // TEST GOES HERE

  // Use $map
  let sfid = $map.sfid
  let nodeid = $map.nodeid
  let subflowConfig = fakeNode({
    z: sfid,
    id: sfid,
    type: $map.subflowType
  })
  let subflow = fakeNode({
    id: sfid,
    type: $map.type
  })

  $nodes.addNode(subflowConfig)
  $nodes.addSubflow(subflow)

  return flowManager.subflowContains(sfid, nodeid)
}

export const flowManager = {
  'subflowContains :- no match': (context: any = {}) => {
    return () => {
      const found = testSubflowContains(context)
      expect(found).toBeFalsy()
    }
  },

  'subflowContains :- matches': (context: any = {}) => {
    return () => {
      const found = testSubflowContains(context)
      // make expectations on return value(s)
      expect(found).toBeTruthy()
    }
  },

  // add more tests here...
}
```