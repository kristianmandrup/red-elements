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
  simulateResponse
} = createResponseSimulations('libraries', 'post')

test('LibraryApi: create', () => {
  expectObj(api)
})

test('LibraryApi: create', () => {
  expectObj(api)
})

const basePath = 'libraries'

describe('LibraryApi: load - server error - fails', () => {

  let api, library, $api
  beforeEach(() => {
    library = new Library()
    api = create(library)
    $api = createApiMethods(api, 'create')
  })

  test('200 OK - missing library - fails', async () => {
    library.library = null
    simulateResponse() // OK
    const result = await $api.one()
    expectError(result)
  })

  test('200 OK - has library - no fail', async () => {
    simulateResponse() // OK
    const result = await $api.one()
    expectNotError(result)
  })
})


describe('LibraryApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, library, $api
  beforeEach(() => {
    library = new Library()
    api = create(library)
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

describe('LibraryApi: create - server error - fails', () => {
})
