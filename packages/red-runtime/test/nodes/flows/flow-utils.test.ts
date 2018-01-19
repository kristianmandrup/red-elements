import {
  FlowUtils
} from '../../..'

import {
  expectObj
} from '../../_infra'

import {
  fakeNode
} from '../../_infra'
import { expectFunction, expectString, expectFunctions } from '../../_infra/helpers';

function create() {
  return new FlowUtils()
}

let flowUtils
beforeEach(() => {
  flowUtils = create()
})

const { log } = console

describe('FlowUtils: diffNodes(oldNode, newNode): any', () => {

})

describe('FlowUtils: mapEnvVarProperties(obj: any, prop: string)', () => {

})

describe('FlowUtils: parseConfig(config: any): IFlow', () => {

})

describe('FlowUtils: diffConfigs(oldConfig: any, newConfig: any): any', () => {

})



