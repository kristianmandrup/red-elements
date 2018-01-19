import {
  SessionApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class Session {
  name: string = 'session'

  constructor() { }
}

const session = new Session()

function create() {
  return new SessionApi({
    $context: session
  })
}

let api
beforeEach(() => {
  api = create()
})

test('SessionApi: create', () => {
  expectObj(api)
})
