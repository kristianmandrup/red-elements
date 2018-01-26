import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../_infra'

import {
  DeploymentsApi
} from '../../../src'

class Deploy {
  name: string = 'deploy'

  constructor() { }
}

function create(deploy: Deploy) {
  return new DeploymentsApi({
    $context: deploy
  })
}

let api
beforeEach(() => {
  const deploy = new Deploy()
  api = create(deploy)
})

const {
  simulateResponse
} = createResponseSimulations('deployments', 'post')

test('DeployApi: create', () => {
  expectObj(api)
})


describe('DeployApi: load - server error - fails', () => {
  let api, deploy, $api
  beforeEach(() => {
    deploy = new Deploy()
    api = create(deploy)
    $api = createApiMethods(api, 'create')
  })

  test('200 OK - missing deploy - fails', async () => {
    deploy.deploy = null
    simulateResponse() // OK
    const result = await $api.one()
    expectError(result)
  })

  test('200 OK - has deploy - no fail', async () => {
    simulateResponse() // OK
    const result = await $api.one()
    expectNotError(result)
  })
})


describe('DeployApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, deploy, $api
  beforeEach(() => {
    deploy = new Deploy()
    api = create(deploy)
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
