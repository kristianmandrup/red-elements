import {
  createApiMethods,
  nock,
  expectObj, expectError, expectNotError
} from '../_infra'

import {
  FlowsApi
} from '../../../src'

class Flows {
  name: string = 'flows'

  constructor() { }
}

function create(flows: Flows) {
  return new FlowsApi({
    $context: flows
  })
}

let api
beforeEach(() => {
  const flows = new Flows()
  api = create(flows)
})

const {
  one,
  many
} = createApiMethods(api)

const {
  simulateResponse
} = createResponseSimulations('flows', 'update')

test('FlowsApi: create', () => {
  expectObj(api)
})


test('FlowsApi: create', () => {
  expectObj(api)
})

describe('FlowsApi: load - server error - fails', () => {

  let api, flows
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
  })

  test('200 OK - missing flows - fails', async () => {
    flows.flows = null
    simulateResponse() // OK
    const result = await one()
    expectError(result)
  })

  test('200 OK - has flows - no fail', async () => {
    simulateResponse() // OK
    const result = await one()
    expectNotError(result)
  })
})


describe('FlowsApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, flows
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await one()
      expectError(result)
    })
  })
})
