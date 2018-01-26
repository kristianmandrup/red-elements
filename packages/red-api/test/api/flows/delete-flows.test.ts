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


test('FlowsApi: create', () => {
  expectObj(api)
})


test('FlowsApi: create', () => {
  expectObj(api)
})

function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('flows')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('flows')
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

describe('FlowsApi: load - server error - fails', () => {

  let api, flows
  beforeEach(() => {
    flows = new Flows()
    api = create(flows)
  })

  test('200 OK - missing flows - fails', async () => {
    flows.flows = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has flows - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
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
      simulateResponseCode(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})
