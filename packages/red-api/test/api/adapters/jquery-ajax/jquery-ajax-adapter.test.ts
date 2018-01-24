import {
  JQueryAjaxAdapter,
  SettingsApi
} from '../../../../'

import { expectObj, expectFunction } from '../../../_infra/helpers';

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
  test('jqXHR status', () => {
    const error = {
      jqXHR: {
        status: 400
      }
    }

    const code = adapter.errorCode(error)
    expect(code).toBe(400)
  })

  test('no status - returns undefined', () => {
    const error = {
      jqXHR: {
      }
    }

    const code = adapter.errorCode(error)
    expect(code).toBeUndefined()
  })
})


describe('JQueryAjaxAdapter: prepareAdapter(config ?: any)', () => {
  test('adds setHeader function', () => {
    const jqXHR = {
    }
    const config = {
      jqXHR
    }
    const prepared = adapter.prepareAdapter(config)
    expectFunction(prepared.setHeader)

  })
  test('- missing jqXHR - fails', () => {
    const config = {}
    expect(() => adapter.prepareAdapter(config)).toThrow()

  })
})

describe('JQueryAjaxAdapter: beforeSend(config ?: any)', () => {
  test('configures ajax and returns self', () => {
    const jqXHR = {
    }
    const config = {
      jqXHR
    }
    const prepared = adapter.beforeSend(config)
    expect(prepared).toBeDefined()
  })
})

describe('JQueryAjaxAdapter: setHeader(name, value)', () => {
  test('not defined', () => {
    const name = 'x', value = '42'
    const prepared = adapter.setHeader(name, value)
    expect(prepared).toBeDefined()

  })
  test('was set via prepareAdapted', () => {
    const name = 'x', value = '42'
    const prepared = adapter.setHeader(name, value)
    expect(prepared).toBeDefined()
  })
})


describe('JQueryAjaxAdapter: async $get(config: IAjaxConfig)', () => {
  test('validate error: no url fails', async () => {
    const onSuccess = () => { }
    const onError = () => { }
    const url = undefined
    const config = {
      onSuccess,
      onError
    }
    expect(async () => await adapter.$get(config)).toThrow()
  })

  test('success', async () => {
    const onSuccess = () => { }
    const onError = () => { }
    const url = 'settings'

    const config = {
      url,
      onSuccess,
      onError
    }
    const result = await adapter.$get(config)
    expect(result).toBeDefined()
  })
  test('failure: URL with no endpoint - fails 401 page not found', async () => {
    const onSuccess = () => { }
    const onError = () => { }
    const url = 'BAD'

    const config = {
      url,
      onSuccess,
      onError
    }
    expect(async () => await adapter.$get(config)).toThrow()
  })
})

