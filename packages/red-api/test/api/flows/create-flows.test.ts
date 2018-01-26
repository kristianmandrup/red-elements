import {
  createApiMethods,
  createResponseSimulations,
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
  simulateResponse
} = createResponseSimulations('libraries', 'post')


test('FlowsApi: create', () => {
  expectObj(api)
})


test('FlowsApi: create', () => {
  expectObj(api)
})

describe('FlowsApi: load - server error - fails', () => {

  let api, flows, $api
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
    $api = createApiMethods(api, 'create')
  })

  test('200  - missing flows - fails', async () => {
    flows.flows = null
    simulateResponse() //
    const result = await $api.one()
    expectError(result)
  })

  test('200  - has flows - no fail', async () => {
    simulateResponse() //
    const result = await $api.one()
    expectNotError(result)
  })
})


describe('FlowsApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, flows, $api
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
    $api = createApiMethods(api, 'create')
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await $api.one()
      expectError(result)
    })
  })
})
