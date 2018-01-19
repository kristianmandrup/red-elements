import {
  SettingsApi
} from '../../../'

import { expectObj } from '../../_infra/helpers';

class Settings {
  name: string = 'settings'

  constructor() { }
}

const settings = new Settings()

function create() {
  return new SettingsApi({
    $context: settings
  })
}

let api
beforeEach(() => {
  api = create()
})

test('SettingsApi: create', () => {
  expectObj(api)
})
