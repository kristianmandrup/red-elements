import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../_infra'

import {
  SessionsApi
} from '../../../'

class Session {
  name: string = 'session'

  constructor() { }
}

const auth = new Session()

function create(auth) {
  return new SessionsApi({
    $context: auth
  })
}

let api
beforeEach(() => {
  api = create(auth)
})

async function revoke(token = 'xyz123') {
  try {
    return await api.revoke(token)
  } catch (err) {
    return {
      error: err
    }
  }
}

const {
  simulateResponse
} = createResponseSimulations('revoke', 'post')

test('SessionApi: revoke - create', () => {
  expectObj(api)
})

describe('SessionApi: revoke - server error - fails', () => {

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  test('200 OK - missing auth - fails', async () => {
    auth.auth = null
    simulateResponse() // OK
    const result = await revoke(auth)
    expectError(result)
  })

  test('200 OK - has auth - no fail', async () => {
    simulateResponse() // OK
    const result = await revoke(auth)
    expectNotError(result)
  })
})


describe('SessionApi: revoke - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await revoke(auth)
      expectError(result)
    })
  })
})
