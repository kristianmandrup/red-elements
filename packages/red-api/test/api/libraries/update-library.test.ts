import {
  createApiMethods,
  nock,
  expectObj, expectError, expectNotError
} from '../_infra'

import {
  LibrariesApi
} from '../../../src'

class Library {
  name: string = 'library'

  constructor() { }
}

function create(library: Library) {
  return new LibrariesApi({
    $context: library
  })
}

let api
beforeEach(() => {
  const library = new Library()
  api = create(library)
})

const {
  one,
  many
} = createApiMethods(api)


test('LibrariesApi: create', () => {
  expectObj(api)
})

test('LibrariesApi: create', () => {
  expectObj(api)
})

const basePath = 'libraries'

function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('libraries')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('libraries')
    .reply(200, data);
}

describe('LibrariesApi: load - server error - fails', () => {

  let api, library
  beforeEach(() => {
    library = new Library()
    api = create(library)
  })

  test('200 OK - missing library - fails', async () => {
    library.library = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has library - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
    expectNotError(result)
  })
})


describe('LibrariesApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, library
  beforeEach(() => {
    library = new Library()
    api = create(library)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponseCode(errorCode)
      const result = await load()
      expectError(result)
    })
  })
})
