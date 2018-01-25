import {
  DeployApi
} from '../../../src'

import * as nock from 'nock'
import { expectObj, expectError, expectNotError } from '../../_infra/helpers';

class Deploy {
  name: string = 'deploy'

  constructor() { }
}

function create(deploy: Deploy) {
  return new DeployApi({
    $context: deploy
  })
}

let api
beforeEach(() => {
  const deploy = new Deploy()
  api = create(deploy)
})

test('DeployApi: create', () => {
  expectObj(api)
})


function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('deploy')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('deploy')
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

describe('DeployApi: load - server error - fails', () => {

  let api, deploy
  beforeEach(() => {
    deploy = new Deploy()
    api = create(deploy)
  })

  test('200 OK - missing deploy - fails', async () => {
    deploy.deploy = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has deploy - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
    expectNotError(result)
  })
})


describe('DeployApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, deploy
  beforeEach(() => {
    deploy = new Deploy()
    api = create(deploy)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponseCode(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})
