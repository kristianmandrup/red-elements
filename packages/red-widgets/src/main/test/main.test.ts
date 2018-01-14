import {
  RED,
  readPage,
  Main
} from './imports'

const {
  log
} = console


function create() {
  return new Main()
}

let main
beforeEach(() => {
  main = create()
})

beforeAll(() => {
  document.documentElement.innerHTML = readPage('simple');
})


test('main: create', () => {
  expect(main).toBeDefined()
})

test('main: loadNodeList', async () => {
  await main.loadNodeList()
  expect(main.loaded.nodeList).toBeTruthy()
})

test('main: loadNodes', async () => {
  await main.loadNodes()
  expect(main.loaded.nodes).toBeTruthy()
})

test('main: loadFlows', async () => {
  await main.loadFlows()
  expect(main.loaded.flows).toBeTruthy()
})

test('main: loadEditor', async () => {
  await main.loadEditor()
  expect(main.loaded.editor).toBeTruthy()
})

test('main: showAbout', async () => {
  let about = await main.showAbout()
  expect(about).toBeDefined()
})
