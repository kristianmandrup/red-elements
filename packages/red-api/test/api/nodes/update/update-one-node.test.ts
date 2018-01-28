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

describe('NodesApi: one', () => {
  describe('OK', () => {
    let nodes, $api
    beforeEach(() => {
      ({ $api, nodes } = createApi())
    })

    test('has nodes - works', async () => {
      simulateResponse() // OK
      const result = await $api.one()
      expectNotError(result)
    })
  })

  describe('API errors', () => {
    let nodes, $api
    beforeEach(() => {
      ({ $api, nodes } = createApi())
    })

    test('200 OK - missing ??', async () => {
      // TODO: setup nodes to be missing sth
      // nodes.nodes = null
      simulateResponse() // OK
      const result = await $api.many()
      expectError(result)
    })

    describe('HTTP server error', () => {
      const errorCodes = [401, 403, 404, 408]

      let nodes, $api
      beforeEach(() => {
        ({ $api, nodes } = createApi())
      })

      errorCodes.map(errorCode => {
        test(`${errorCode} error`, async () => {
          simulateResponse(errorCode)
          const result = await $api.one()
          expectError(result)
        })
      })
    })
  })
})

