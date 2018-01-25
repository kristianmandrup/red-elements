import {
  SettingsApi
} from '../../../src'

import * as nock from 'nock'
import { expectObj, expectError, expectNotError } from '../../_infra/helpers';

const { log } = console

const ctxSettings = {
  get() {
    return 'x'
  }
}

class Settings {
  name: string = 'settings'
  settings = ctxSettings // needed for beforeSend of API

  constructor() { }
}

function create(settings: Settings) {
  return new SettingsApi({
    $context: settings
  })
}

let api
beforeEach(() => {
  const settings = new Settings()
  api = create(settings)
})

test('SettingsApi: create', () => {
  expectObj(api)
})

function simulateResponseCode(code) {
  return nock(/localhost/)
    .get('settings')
    .reply(code);
}

function simulateResponseOK(data = {}) {
  return nock(/localhost/)
    .get('settings')
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

describe('SettingsApi: load - server error - fails', () => {

  let api, settings
  beforeEach(() => {
    settings = new Settings()
    api = create(settings)
  })

  test('200 OK - missing settings - fails', async () => {
    settings.settings = null
    simulateResponseOK() // OK
    const result = await load()
    expectError(result)
  })

  test('200 OK - has settings - no fail', async () => {
    simulateResponseOK() // OK
    const result = await load()
    expectNotError(result)
  })
})


describe('SettingsApi: load - server error - fails', () => {
  const errorCodes = [401, 403, 404, 408]

  let api, settings
  beforeEach(() => {
    settings = new Settings()
    api = create(settings)
  })

  errorCodes.map(errorCode => {
    test(`${errorCode} error`, async () => {
      simulateResponseCode(errorCode)
      const result = await load()
      log({
        result
      })
      expectError(result)
    })
  })
})
