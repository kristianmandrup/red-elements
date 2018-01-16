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
