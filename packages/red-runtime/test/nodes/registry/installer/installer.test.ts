import {
  Installer
} from '../../../..'
import { expectObj } from '../../../_infra/helpers';

function create() {
  return new Installer()
}

let installer
beforeEach(() => {
  installer = create()
})

test('Installer: create', () => {
  expectObj(installer)
})
