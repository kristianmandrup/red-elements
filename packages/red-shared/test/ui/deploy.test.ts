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

const { log } = console

function fakeNode(override = {}, def = true) {
  let base: any = {
    id: 'x',
    in: {},
    out: {},
    type: 'subflow'
  }

  if (def) {
    base._def = {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }

  return Object.assign(base, override)
}

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
  expect(deploy.deploymentType).toBe('test')
})

test(`Deploy: changeDeploymentType('production')`, () => {
  deploy.changeDeploymentType('production')
  expect(deploy.deploymentType).toBe('production')
})

test('Deploy: getNodeInfo(node)', () => {
  const node = fakeNode({
    id: 'x',
    type: 'subflow'
  })

  // return
  // {
  //   tab: tabLabel,
  //   type: node.type,
  //   label: label
  // };

  const info = deploy.getNodeInfo(node)
  log({
    info
  })
  expect(typeof info).toBe('object')
  expect(info.type).toBe(node.type)
})

test.only('Deploy: sortNodeInfo(A, B) - default', () => {
  const nodeA = fakeNode({
    id: 'a',
  })
  const nodeB = fakeNode({
    id: 'b',
  })

  const A = deploy.getNodeInfo(nodeA)
  const B = deploy.getNodeInfo(nodeB)
  const sorted = deploy.sortNodeInfo(A, B)

  log({
    sorted
  })

  expect(sorted).toBe(0)
  // TODO: add real expectations on sort result
})

test.only('Deploy: sortNodeInfo(A, B) - tab', () => {
  const nodeA = fakeNode({
    id: 'a',
    tab: 'x'
  })
  const nodeB = fakeNode({
    id: 'b',
    tab: 'y'
  })

  const A = deploy.getNodeInfo(nodeA)
  const B = deploy.getNodeInfo(nodeB)
  const sorted = deploy.sortNodeInfo(A, B)

  log('sort tab', {
    nodeA,
    nodeB,
    A,
    B,
    sorted
  })

  expect(sorted).toBeDefined()
  // TODO: add real expectations on sort result
})

test.only('Deploy: sortNodeInfo(A, B) - type', () => {
  const nodeA = fakeNode({
    id: 'a',
    type: 'config'
  })
  const nodeB = fakeNode({
    id: 'b',
    type: 'io'
  })

  const A = deploy.getNodeInfo(nodeA)
  const B = deploy.getNodeInfo(nodeB)
  const sorted = deploy.sortNodeInfo(A, B)

  log('sort type', {
    nodeA,
    nodeB,
    A,
    B,
    sorted
  })

  expect(sorted).toBeDefined()
  // TODO: add real expectations on sort result
})

test.only('Deploy: sortNodeInfo(A, B) - name', () => {
  const nodeA = fakeNode({
    id: 'a',
    name: 'ape'
  })
  const nodeB = fakeNode({
    id: 'b',
    name: 'zebra'
  })

  const A = deploy.getNodeInfo(nodeA)
  const B = deploy.getNodeInfo(nodeB)
  const sorted = deploy.sortNodeInfo(A, B)

  log('sort name', {
    nodeA,
    nodeB,
    A,
    B,
    sorted
  })

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





