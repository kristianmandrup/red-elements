import * as nock from 'nock'
export { expectObj, expectError, expectNotError } from '../../_infra/helpers';

export {
  nock
}

import {
  mockResponses
} from '../_mock-responses'

export function createResponseSimulations(modelName, method = 'get', id?) {
  return {
    simulateResponse(code = 200, data?) {
      const model = mockResponses[modelName]
      if (!model) {
        throw `No model ${modelName} defined in mockResponses`
      }
      const fakeData = model[code]
      data = data || fakeData

      const path = id ? [modelName, id].join('/') : modelName

      return nock(/localhost/)
      [method](path)
        .reply(code, data || fakeData);
    }
  }
}


export function createApiMethods(api, method = 'read') {
  api = api[method]
  return {
    one: async (id = 'x', data?) => {
      id = id || 'x'
      data = data || {
        txt: 'hello'
      }
      try {
        return await api.one(id, data)
      } catch (err) {
        return {
          error: err
        }
      }
    },
    many: async (ids, data = {}) => {
      ids = ids || ['x', 'y']
      try {
        return await api.many(ids, data)
      } catch (err) {
        return {
          error: err
        }
      }
    }
  }
}
