const nightmare = require('../nightmare')
import {
  Diff
} from './ui'
const ctx = {}

function create(ctx) {
  return new Diff(ctx)
}

test('Diff: create', () => {
  let diff = create(ctx)
  expect(diff.currentDiff).toEqual({})
  expect(diff.diffVisible).toBeFalsy()
})

test('Diff: buildDiffPanel', () => {
  let diff = create(ctx)
  let container = $('#container')
  diff.buildDiffPanel(container)

  // use nightmare
})

test('Diff: formatWireProperty', () => {
  let diff = create(ctx)
  let container = $('#container')

  // TODO: real data
  let wires = []
  let allNodes = []
  diff.formatWireProperty(wires, allNodes)

  // use nightmare
})

test('Diff: createNodeIcon', () => {
  let diff = create(ctx)
  // TODO: real data
  let node = {}
  let def = {}
  diff.createNodeIcon(node, def)

  // use nightmare
})

test('Diff: createNode', () => {
  let diff = create(ctx)
  // TODO: real data
  let node = {}
  let def = {}
  diff.createNode(node, def)

  // use nightmare
})
test('Diff: createNodeDiffRow', () => {
  let diff = create(ctx)
  // TODO: real data
  let node = {}
  let stats = {}
  diff.createNodeDiffRow(node, stats)

  // use nightmare
})
test('Diff: createNodePropertiesTable', () => {
  let diff = create(ctx)
  // TODO: real data
  let node = {}
  let def = {}
  let localNodeObj = {}
  let remoteNodeObj = {}
  diff.createNodePropertiesTable(def, node, localNodeObj, remoteNodeObj)

  // use nightmare
})

test('Diff: createNodeConflictRadioBoxes', () => {
  let diff = create(ctx)
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
  let diff = create(ctx)
  diff.refreshConflictHeader()

  // use nightmare
})

test('Diff: getRemoteDiff', () => {
  let diff = create(ctx)
  let cb = function () {
    return 'x'
  }
  diff.getRemoteDiff(cb)
  // use nightmare
})

test('Diff: showRemoteDiff', () => {
  let diff = create(ctx)
  let difference = {}
  diff.showRemoteDiff(difference)
  // use nightmare
})

test('Diff: parseNodes', () => {
  let diff = create(ctx)
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
  let diff = create(ctx)
  let node = {
    id: 'x'
  }
  let currentNodes = []
  let newNodes = []
  diff.generateDiff(currentNodes, newNodes)
  // use nightmare
})

test('Diff: resolveDiffs', () => {
  let diff = create(ctx)
  let localDiff = {}
  let remoteDiff = {}
  diff.resolveDiffs(localDiff, remoteDiff)
  // use nightmare
})

test('Diff: showDiff', () => {
  let diff = create(ctx)
  let difference = {}
  diff.showDiff(difference)
  // use nightmare
})

test('Diff: mergeDiff', () => {
  let diff = create(ctx)
  let difference = {}
  diff.mergeDiff(difference)
  // use nightmare
})
