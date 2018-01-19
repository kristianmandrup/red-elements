import {
  LibraryApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class Library {
  name: string = 'library'

  constructor() { }
}

const library = new Library()

function create() {
  return new LibraryApi({
    $context: library
  })
}

let api
beforeEach(() => {
  api = create()
})

test('LibraryApi: create', () => {
  expectObj(api)
})
