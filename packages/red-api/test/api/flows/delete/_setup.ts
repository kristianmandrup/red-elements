import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../../_infra'

import {
  FlowsApi
} from '../../../../src'

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

const $method = 'delete'

const {
  simulateResponse
} = createResponseSimulations('flows', $method)

function createApi(method?) {
  const flows = new Flows()
  const api = create(flows)

  return {
    flows,
    $api: createApiMethods(api, method || $method)
  }
}

export {
  simulateResponse,
  api,
  create,
  Flows,
  FlowsApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
}
