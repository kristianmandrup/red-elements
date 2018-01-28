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

const {
  simulateResponse
} = createResponseSimulations('flows', 'create')

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
