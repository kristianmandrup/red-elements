import {
  simulateResponse,
  api,
  create,
  Nodes,
  NodesApi,
  createApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from './_setup'
test('NodesApi: create', () => {
  expectObj(api)
})

describe('NodesApi: load - server error - fails', () => {

  let api, nodes
  beforeEach(() => {
    nodes = new Nodes()
    api = create(nodes)
  })

  test('200 OK - missing nodes - fails', async () => {
    nodes.nodes = null
    simulateResponse() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has nodes - no fail', async () => {
    simulateResponse() // OK
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
      simulateResponse(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})
