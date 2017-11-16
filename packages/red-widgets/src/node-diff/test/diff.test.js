import {
  RED,
  readPage,
  ctx as baseCtx,
  Diff,
  EditableList
} from './imports'

const {
  log
} = console

// TODO:
// investigate legacy Library
// to figure out which class to use in each case
// set to real instance for each!
// See red-runtime
let actions = {
  add() {}
}
let keyboard = {
  add() {}
}

let utils = {
  getNodeIcon() {
    // url to icon
    return 'node/icon.png'
  }
}

let nodes = {
  getType() {}
}


let ctx = Object.assign({
  actions,
  keyboard,
  utils,
  // events,
  // settings,
  nodes,
  // view
}, baseCtx)


function create(ctx) {
  return new Diff(ctx)
}

let diff
beforeEach(() => {
  diff = create(ctx)
})

beforeAll(() => {
  EditableList(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('diff', __dirname)
})


test('Diff: create', () => {
  expect(diff.currentDiff).toEqual({})
  expect(diff.diffVisible).toBeFalsy()
})

test('Diff: buildDiffPanel', () => {
  let container = $('#container')
  if (container) {
    let panel = diff.buildDiffPanel(container)
    log({
      panel
    })
  }


  // use nightmare
})

test('Diff: formatWireProperty', () => {
  let container = $('#container')

  // TODO: real data
  let wires = []
  let allNodes = []
  diff.formatWireProperty(wires, allNodes)

  // use nightmare
})

test('Diff: createNodeIcon', () => {
  // TODO: real data
  let node = {}
  let def = {}
  diff.createNodeIcon(node, def)

  // use nightmare
})

test('Diff: createNode', () => {
  // TODO: real data
  let node = {}
  let def = {}
  diff.createNode(node, def)

  // use nightmare
})

function Stat() {
  return {
    addedCount: 0,
    deletedCount: 0,
    changedCount: 0
  }
}

test.only('Diff: createNodeDiffRow', () => {
  // TODO: real data
  let node = {}
  let stats = {
    local: new Stat(),
    remote: new Stat()
  }
  diff.createNodeDiffRow(node, stats)

  // use nightmare
})

test('Diff: createNodePropertiesTable', () => {
  // TODO: real data
  let node = {}
  let def = {}
  let localNodeObj = {}
  let remoteNodeObj = {}
  diff.createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj)

  // use nightmare
})

test('Diff: createNodeConflictRadioBoxes', () => {
  // TODO: real data
  let node = {}
  let row = {}
  let localDiv = {}
  let remoteDiv = {}
  let propertiesTable = {}
  let hide = true
  let state = {}
  diff.createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)

  // use nightmare
})

test('Diff: refreshConflictHeader', () => {
  diff.refreshConflictHeader()

  // use nightmare
})

test('Diff: getRemoteDiff', () => {
  let cb = function () {
    return 'x'
  }
  diff.getRemoteDiff(cb)
  // use nightmare
})

test('Diff: showRemoteDiff', () => {
  let difference = {}
  diff.showRemoteDiff(difference)
  // use nightmare
})

test('Diff: parseNodes', () => {
  let node = {
    id: 'x'
  }
  let nodeList = [
    node
  ]
  diff.parseNodes(nodeList)
  // use nightmare
})

test('Diff: generateDiff', () => {
  let node = {
    id: 'x'
  }
  let currentNodes = []
  let newNodes = []
  diff.generateDiff(currentNodes, newNodes)
  // use nightmare
})

test('Diff: resolveDiffs', () => {
  let localDiff = {}
  let remoteDiff = {}
  diff.resolveDiffs(localDiff, remoteDiff)
  // use nightmare
})

test('Diff: showDiff', () => {
  let difference = {}
  diff.showDiff(difference)
  // use nightmare
})

test('Diff: mergeDiff', () => {
  let difference = {}
  diff.mergeDiff(difference)
  // use nightmare
})