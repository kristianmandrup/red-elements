import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../../_infra'

import {
  DeploymentsApi
} from '../../../../src'

class Deployments {
  name: string = 'deployments'

  constructor() { }
}

function create(deployments: Deployments) {
  return new DeploymentsApi({
    $context: deployments
  })
}

let api
beforeEach(() => {
  const deployments = new Deployments()
  api = create(deployments)
})

const $method = 'delete'
const $basePath = 'deployments'

const {
  simulateResponse
} = createResponseSimulations($basePath, $method)

function createApi(method?) {
  const deployments = new Deployments()
  const api = create(deployments)

  return {
    deployments,
    $api: createApiMethods(api, method || $method)
  }
}

export {
  simulateResponse,
  api,
  createApi,
  create,
  Deployments,
  DeploymentsApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
}
