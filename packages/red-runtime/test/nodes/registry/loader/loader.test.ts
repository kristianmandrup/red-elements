import {
  Loader
} from '../../../..'
import { expectObj } from '../../../_infra/helpers';

function create() {
  return new Loader()
}

let loader
beforeEach(() => {
  loader = create()
})

test('Loader: create', () => {
  expectObj(loader)
})
