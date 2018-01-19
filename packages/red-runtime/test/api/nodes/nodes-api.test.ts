import {
  NodesApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class Nodes {
  name: string = 'nodes'

  constructor() { }
}

const nodes = new Nodes()

function create() {
  return new NodesApi({
    $context: nodes
  })
}

let api
beforeEach(() => {
  api = create()
})

test('NodesApi: create', () => {
  expectObj(api)
})
