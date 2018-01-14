import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  Deploy
} = widgets

function create() {
  return new Deploy()
}

let deploy
beforeEach(() => {
  deploy = create()
})

beforeAll(() => {
  // widgets that need to be available
  // EditableList(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('deploy');
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

// By default the following deploymentTypes are made available:
// - full
// - nodes
// - flows
test(`Deploy: changeDeploymentType - no deploymentType registered for type`, () => {
  expect(() => deploy.changeDeploymentType('unknown')).toThrow()
})

test(`Deploy: changeDeploymentType('full')`, () => {
  deploy.changeDeploymentType('full')
  expect(deploy.deploymentType).toBe('full')
})

test(`Deploy: changeDeploymentType('flows')`, () => {
  deploy.changeDeploymentType('flows')
  expect(deploy.deploymentType).toBe('flows')
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

test('Deploy: sortNodeInfo(A, B) - default', () => {
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
})

// TODO: improve it, should work on -1 and +1
test('Deploy: sortNodeInfo(A, B) - tab', () => {
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

  // override node info for sorting
  A.tab = 'x'
  B.tab = 'y'

  const sorted = deploy.sortNodeInfo(A, B)

  log('sort tab', {
    nodeA,
    nodeB,
    A,
    B,
    sorted
  })

  expect(sorted).toBe(-1)
})

// TODO: improve it, should work on -1 and +1
test('Deploy: sortNodeInfo(A, B) - type', () => {
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

  // override node info for sorting
  // A.type = 'type'
  // B.type = 'io'

  const sorted = deploy.sortNodeInfo(A, B)

  log('sort type', {
    nodeA,
    nodeB,
    A,
    B,
    sorted
  })

  expect(sorted).toBe(-1)
})

// TODO: improve it, should work on -1 and +1
test('Deploy: sortNodeInfo(A, B) - name', () => {
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

  // override node info for sorting
  A.name = 'ape'
  B.name = 'zebra'

  const sorted = deploy.sortNodeInfo(A, B)

  log('sort name', {
    nodeA,
    nodeB,
    A,
    B,
    sorted
  })

  expect(sorted).toBe(-1)
})


test('Deploy: resolveConflict(currentNodes, activeDeploy)', () => {
  const nodeA = fakeNode({
    id: 'a',
  })
  const nodeB = fakeNode({
    id: 'b',
  })

  const currentNodes = [nodeA, nodeB]
  const activeDeploy = {
  }
  const resolved = deploy.resolveConflict(currentNodes, activeDeploy)
  expect(resolved).toBeDefined()
})

test('Deploy: save(true, true) - deploy button disabled - no deploy in flight', () => {
  $("#btn-deploy").addClass("disabled")
  const skipValidation = true
  const force = true
  const beforeTime: number = new Date().getUTCMilliseconds()
  deploy.save(skipValidation, force)
  const afterTime = deploy.lastDeployAttemptTime
  expect(afterTime).toBe(null)
})

test('Deploy: save(true, true)', () => {
  $("#btn-deploy").removeClass("disabled")
  const skipValidation = true
  const force = true
  const beforeTime: number = new Date().getUTCMilliseconds()
  deploy.save(skipValidation, force)
  const afterTime = deploy.lastDeployAttemptTime.getUTCMilliseconds()
  expect(afterTime).toBeGreaterThanOrEqual(beforeTime)
})

test('Deploy: save(true, false)', () => {
  $("#btn-deploy").removeClass("disabled")
  const skipValidation = true
  const force = false
  const beforeTime: number = new Date().getUTCMilliseconds()
  deploy.save(skipValidation, force)
  const afterTime = deploy.lastDeployAttemptTime.getUTCMilliseconds()
  expect(afterTime).toBeGreaterThanOrEqual(beforeTime)
})

test('Deploy: save(false, false)', () => {
  $("#btn-deploy").removeClass("disabled")
  const skipValidation = false
  const force = false
  const beforeTime: number = new Date().getUTCMilliseconds()
  deploy.save(skipValidation, force)
  // since warning is shown and returned before attempting ajax
  // expect(afterTime).toBe(null)
  const afterTime = deploy.lastDeployAttemptTime.getUTCMilliseconds()
  expect(afterTime).toBeGreaterThanOrEqual(beforeTime)
})





