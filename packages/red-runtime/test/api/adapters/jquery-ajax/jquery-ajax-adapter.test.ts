import {
  JQueryAjaxAdapter,
  SettingsApi
} from '../../../../'

import { expectObj } from '../../../_infra/helpers';

class Settings {
  name: string = 'settings'

  constructor() { }
}

const settings = new Settings()

const $api = new SettingsApi({
  $context: settings
})

function create() {
  return new JQueryAjaxAdapter({
    $api
  })
}

let adapter
beforeEach(() => {
  adapter = create()
})

test('JQueryAjaxAdapter: create', () => {
  expectObj(adapter)
})


describe('JQueryAjaxAdapter: errorCode(error)', () => {
})

describe('JQueryAjaxAdapter: prepareAdapter(config ?: any)', () => {
})

describe('JQueryAjaxAdapter: beforeSend(config ?: any)', () => {
})

describe('JQueryAjaxAdapter: setHeader(name, value)', () => {
})

describe('JQueryAjaxAdapter: async $get(config: IAjaxConfig)', async () => {
})

