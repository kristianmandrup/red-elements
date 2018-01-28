import {
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
} from '../../_infra'

import {
  ProjectsApi
} from '../../../../src'

class Projects {
  name: string = 'projects'

  constructor() { }
}

function create(projects: Projects) {
  return new ProjectsApi({
    $context: projects
  })
}

let api
beforeEach(() => {
  const projects = new Projects()
  api = create(projects)
})

const $method = 'delete'
const $basePath = 'projects'

const {
  simulateResponse
} = createResponseSimulations($basePath, $method)

function createApi(method?) {
  const projects = new Projects()
  const api = create(projects)

  return {
    projects,
    $api: createApiMethods(api, method || $method)
  }
}

export {
  simulateResponse,
  api,
  createApi,
  create,
  Projects,
  ProjectsApi,
  createApiMethods,
  createResponseSimulations,
  expectObj, expectError, expectNotError
}
