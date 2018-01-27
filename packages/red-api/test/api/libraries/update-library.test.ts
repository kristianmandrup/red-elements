import {
  createApiMethods,
  createResponseSimulations,
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
} = createApiMethods(api, 'read')

const {
  simulateResponse
} = createResponseSimulations('libraries', 'update')


test('LibrariesApi: create', () => {
  expectObj(api)
})

test('LibrariesApi: create', () => {
  expectObj(api)
})

const basePath = 'libraries'

describe('LibrariesApi: load - server error - fails', () => {

  let api, library
  beforeEach(() => {
    library = new Library()
    api = create(library)
  })

  test('200 OK - missing library - fails', async () => {
    library.library = null
    simulateResponse() // OK
    const result = await one()
    expectError(result)
  })

  test('200 OK - has library - no fail', async () => {
    simulateResponse() // OK
    const result = await one()
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
      simulateResponse(errorCode)
      const result = await one()
      expectError(result)
    })
  })
})
