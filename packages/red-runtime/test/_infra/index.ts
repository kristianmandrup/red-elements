export {
  expectIs,
  expectEqual,
  expectObj,
  expectFunction,
  expectString,
  expectArray,
  expectTruthy,
  expectDefined,
  expectUndefined,

  expectObjs,
  expectFunctions
} from './helpers'

import {
  INode
} from '../../src/interfaces'

export function prepareTests(factories, buildContext) {
  return Object.keys(factories).map(label => {
    // essentially the beforeEach test setup using test factory
    const createTest = factories[label]
    const context = buildContext()

    const matches = /:- (.+)/.exec(label)
    if (matches) {
      context.$label = matches[1]
    }
    return {
      $label: label,
      $fun: createTest(context)
    }
  })
}

export function fakeNode(override = {}, def = true) {
  let base: INode = {
    id: 'x',
    in: [],
    out: [],
    type: 'subflow'
  }

  if (def) {
    base._def = {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }

  return Object.assign(base, override)
}
