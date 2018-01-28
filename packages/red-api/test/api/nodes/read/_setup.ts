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

function create(library: Nodes) {
  return new NodesApi({
    $context: library
  })
}

let api
beforeEach(() => {
  const library = new Nodes()
  api = create(library)
})

const $method = 'read'
const $basePath = 'nodes'

const {
  simulateResponse
} = createResponseSimulations($basePath, $method)

function createApi(method?) {
  const library = new Nodes()
  const api = create(library)

  return {
    library,
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
