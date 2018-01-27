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

async function logout() {
  try {
    return await api.logout()
  } catch (err) {
    return {
      error: err
    }
  }
}

const {
  simulateResponse
} = createResponseSimulations('logout', 'post')


test('SessionsApi: token - create', () => {
  expectObj(api)
})

describe('SessionsApi: token - server error - fails', () => {

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  test('200 OK - missing auth - fails', async () => {
    auth.auth = null
    simulateResponse() // OK
    const result = await logout()
    expectError(result)
  })

  test('200 OK - has auth - no fail', async () => {
    simulateResponse() // OK
    const result = await logout()
    expectNotError(result)
  })
})


describe('SessionsApi: token - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await logout()
      expectError(result)
    })
  })
})
