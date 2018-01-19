import {
  FlowsApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class Flows {
  name: string = 'flows'

  constructor() { }
}

const flows = new Flows()

function create() {
  return new FlowsApi({
    $context: flows
  })
}

let api
beforeEach(() => {
  api = create()
})

test('FlowsApi: create', () => {
  expectObj(api)
})
