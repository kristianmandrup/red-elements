import {
  NodeCredentials
} from '../../..'

import {
  expectObj
} from '../../_infra'

import {
  fakeNode
} from '../../_infra'
import { expectFunction, expectString, expectFunctions } from '../../_infra/helpers';

function create() {
  return new NodeCredentials()
}

let credentials
beforeEach(() => {
  credentials = create()
})

const { log } = console

test('NodeCredentials: create', () => {
  expectObj(credentials)
})


describe('NodeCredentials: load(credentials: any): Promise<any>', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: add(id: string, creds: any): INodeCredentials', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: get(id: string): any', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: delete (id: string): INodeCredentials', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: clean(config: any): INodeCredentials', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: register(type: string, definition: any): INodeCredentials', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: export (): Promise<any>', () => {
  test('x', () => {

  })
})

describe('NodeCredentials: dirty: boolean', () => {
  test('x', () => {

  })
})





