import {
  LibraryApi
} from '../../../'

import * as nock from 'nock'
import { expectObj, expectError, expectNotError } from '../../_infra/helpers';

class Library {
  name: string = 'library'

  constructor() { }
}

function create(library: Library) {
  return new LibraryApi({
    $context: library
  })
}

let api
beforeEach(() => {
  const library = new Library()
  api = create(library)
})

test('LibraryApi: create', () => {
  expectObj(api)
})



test('LibraryApi: create', () => {
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


async function load() {
  try {
    return await api.load()
  } catch (err) {
    return {
      error: err
    }
  }
}

describe('LibraryApi: load - server error - fails', () => {

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


describe('LibraryApi: load - server error - fails', () => {
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
