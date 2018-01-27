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

async function login(credentials) {
  try {
    return await api.login(credentials)
  } catch (err) {
    return {
      error: err
    }
  }
}

const {
  simulateResponse
} = createResponseSimulations('login', 'post')


test('SessionsApi: login - create', () => {
  expectObj(api)
})


describe('SessionsApi: login - server error - fails', () => {

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  test('200 OK - missing auth - fails', async () => {
    auth.auth = null
    simulateResponse() // OK
    const result = await login(auth)
    expectError(result)
  })

  test('200 OK - has auth - no fail', async () => {
    simulateResponse() // OK
    const result = await login(auth)
    expectNotError(result)
  })
})


describe('SessionsApi: login - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponse(errorCode)
      const result = await login(auth)
      expectError(result)
    })
  })
})
