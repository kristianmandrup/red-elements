import {
  createApiMethods,
  nock,
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

test('SessionsApi: token - create', () => {
  expectObj(api)
})

function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('auth/token')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('auth/token')
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

describe('SessionsApi: token - server error - fails', () => {

  let api, auth
  beforeEach(() => {
    auth = new Session()
    api = create(auth)
  })

  test('200 OK - missing auth - fails', async () => {
    auth.auth = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has auth - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
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
      simulateResponseCode(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})