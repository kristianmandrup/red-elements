import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../../_infra'

import {
  NodesApi
} from '../../../../src'

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

const $method = 'update'
const $basePath = 'nodes'

const {
  simulateResponse
} = createResponseSimulations($basePath, $method)

function createApi(method?) {
  const nodes = new Nodes()
  const api = create(nodes)

  return {
    nodes,
    $api: createApiMethods(api, method || $method)
  }
}

export {
  simulateResponse,
  api,
  createApi,
  create,
  Nodes,
  NodesApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
}
