import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../../_infra'

import {
  LibrariesApi
} from '../../../../src'

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
} = createResponseSimulations('libraries', 'delete')

function createApi(method?) {
  const library = new Library()
  const api = create(library)

  return {
    library,
    $api: createApiMethods(api, method || 'update')
  }
}

export {
  simulateResponse,
  api,
  createApi,
  create,
  Library,
  LibrariesApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
}
