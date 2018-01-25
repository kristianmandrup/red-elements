import {
  NodesApi
} from '../../../src'

import * as nock from 'nock'
import { expectObj, expectError, expectNotError } from '../../_infra/helpers';

class Nodes {
  name: string = 'nodes'

  constructor() { }
}

function create(nodes: Nodes) {
  return new NodesApi({
    $context: nodes
  })
}

let api
beforeEach(() => {
  const nodes = new Nodes()
  api = create(nodes)
})

test('NodesApi: create', () => {
  expectObj(api)
})



test('NodesApi: create', () => {
  expectObj(api)
})

function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('nodes')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('nodes')
    .reply(200, data);
}


async function load() {
  try {
    return await api.load()
  } catch (err) {
    return {
      error: err
    }
  }
}

describe('NodesApi: load - server error - fails', () => {

  let api, nodes
  beforeEach(() => {
    nodes = new Nodes()
    api = create(nodes)
  })

  test('200 OK - missing nodes - fails', async () => {
    nodes.nodes = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has nodes - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
    expectNotError(result)
  })
})


describe('NodesApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, nodes
  beforeEach(() => {
    nodes = new Nodes()
    api = create(nodes)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponseCode(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})