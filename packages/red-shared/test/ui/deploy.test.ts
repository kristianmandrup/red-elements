import {
  Deploy
} from '../..'

function create() {
  return new Deploy()
}

let deploy
beforeEach(() => {
  deploy = create()
})

test('Deploy: create', () => {
  expect(typeof deploy).toBe('object')
})

test('Deploy: create w options - type: development', () => {
  const options = {
    type: 'development'
  }
  deploy = new Deploy(options)
})

test(`Deploy: changeDeploymentType('test')`, () => {
  deploy.changeDeploymentType('test')
  const deploySrc = $("#btn-deploy-icon").attr("src")
  expect(deploySrc).toBe('test')
})

test(`Deploy: changeDeploymentType('production')`, () => {
  deploy.changeDeploymentType('production')
  const deploySrc = $("#btn-deploy-icon").attr("src")
  expect(deploySrc).toBe('production')
})

test('Deploy: getNodeInfo(node)', () => {
  const node = {
    id: 'x',
    _def: {

    }
  }
  const info = deploy.getNodeInfo(node)
  expect(typeof info).toBe('object')
})

test('Deploy: sortNodeInfo(A, B)', () => {
  const nodeA = {
    id: 'a',
    _def: {

    }
  }
  const nodeB = {
    id: 'b',
    _def: {

    }
  }

  const A = deploy.getNodeInfo(nodeA)
  const B = deploy.getNodeInfo(nodeB)
  const sorted = deploy.sortNodeInfo(A, B)
  expect(sorted).toBeDefined()
  // TODO: add real expectations on sort result
})

test('Deploy: resolveConflict(currentNodes, activeDeploy)', () => {
  const nodeA = {
    id: 'a',
    _def: {

    }
  }
  const nodeB = {
    id: 'b',
    _def: {

    }
  }
  const currentNodes = [nodeA, nodeB]
  const activeDeploy = {

  }
  const resolved = deploy.resolveConflict(currentNodes, activeDeploy)
  expect(resolved).toBeDefined()
})

test('Deploy: save(true, true)', () => {
  const skipValidation = true
  const force = true
  deploy.save(skipValidation, force)
})

test('Deploy: save(true, false)', () => {
  const skipValidation = true
  const force = false
  deploy.save(skipValidation, force)
})

test('Deploy: save(false, false)', () => {
  const skipValidation = false
  const force = false
  deploy.save(skipValidation, force)
})





