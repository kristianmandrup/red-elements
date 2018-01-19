import {
  DeployApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class Deploy {
  name: string = 'deploy'

  constructor() { }
}

const deploy = new Deploy()

function create() {
  return new DeployApi({
    $context: deploy
  })
}

let api
beforeEach(() => {
  api = create()
})

test('DeployApi: create', () => {
  expectObj(api)
})
