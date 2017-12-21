import {
  RED,
  readPage,
  ctx as baseCtx,
  NodeDiff,
  EditableList
} from './imports'
import { setTimeout } from 'timers';

const {
  log
} = console
let trayOptions;
// TODO:
// investigate legacy Library
// to figure out which class to use in each case
// set to real instance for each!
// See red-runtime
let actions = {
  add() { }
}
let keyboard = {
  add() { }
}

let utils = {
  getNodeIcon() {
    // url to icon
    return 'node/icon.png'
  }
}

let nodes = {
  getType() { },
  node(id?) {
    if (id === 'test1') {
      return { changed: {} }
    }
  },
  import() { return [[]] },
  createCompleteNodeSet() { },
  dirty() { },
  version() { },
  clear() { },
  workspace(id) { return { id: 'a' } },
  subflow() { }
}
let tray = {
  close() { },
  show(trayOpt) {
    trayOptions = trayOpt;
  }
}
let history = {
  push(evt) { }
}
let view = {
  redraw() { }
}
let palette = {
  refresh() { }
}
let workspaces = {
  refresh() { }
}
let sidebar = {
  config: {
    refresh() { }
  }
}

let ctx = Object.assign({
  actions,
  keyboard,
  utils,
  // events,
  // settings,
  nodes,
  tray,
  history,
  view,
  palette,
  sidebar,
  workspaces
}, baseCtx)


function create(ctx) {
  return new NodeDiff()
}

let diff
beforeEach(() => {
})

beforeAll(() => {
  new EditableList()
  diff = create(ctx)
  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('../red-widgets/src/node-diff/test/app/diff');
})


test('Diff: create', () => {
  expect(diff.currentDiff).toEqual({})
  expect(diff.diffVisible).toBeFalsy()
})

test('Diff: buildDiffPanel', () => {
  let container = $('#container')
  if (container) {
    let panel = diff.buildDiffPanel(container)
  }
})

test('Diff: buildDiffPanel', () => {
  let container = $('#container')
  if (container) {
    let panel = diff.buildDiffPanel(container);
    let localDiff = {
      currentConfig: {
        all: ['a', 'b', 'c'],
        added: ['d', 'e']
      },
      newConfig: {
        all: ['a', 'b']
      },
      changed: ['t', 'u'],
      deleted: ['trre', 'eer']
    }
    let remoteDiff = {
      deleted: ['x', 'y'],
      changed: ['t', 'u'],
      added: []
    }
    let object = {
      diff: localDiff,
      remoteDiff: remoteDiff,
      tab: {
        n: {}
      },
      def: {},
      conflicts: ['a'],
      resolutions: []
    }
    //    diffList.editableList('addItem')
  }
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

test('Diff: createNodeDiffRow', () => {
  // TODO: real data
  var diff = create(ctx);
  let node = {
    id: '25test.stt'
  }
  let stats = {
    local: Stat(),
    remote: Stat()
  }
  diff.currentDiff = {
    localDiff: {
      newConfig: {
        all: ['a', 'b']
      }
    },
    remoteDiff: {
      newConfig: {
        all: ['a', 'b']
      }
    },
    resolutions: []
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



// test('Diff: refreshConflictHeader', () => {
//   diff.refreshConflictHeader()

//   // use nightmare
// })

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

test('Diff: showRemoteDiff', () => {
  let difference = {}
  diff.showRemoteDiff(difference)
  // use nightmare
})

test('Diff: parseNodes', () => {
  let node = {
    id: 'x',
    type: 'tab'
  }
  let node1 = {
    id: 'x2',
    type: 'subflow'
  }
  let node2 = {
    id: 'x3',
    type: '',
    z: 'x'
  }
  let node3 = {
    id: 'x2',
    type: '',
    z: 'x2'
  }
  let node4 = {
    id: 'xss',
    type: '',
  }
  let nodeList = [
    node,
    node1,
    node2,
    node3,
    node4
  ]
  var parseNode = diff.parseNodes(nodeList)
  expect(typeof parseNode).toBe('object')
  // use nightmare
})

test('Diff: generateDiff', () => {
  let node = {
    id: 'x',
    type: 'tab'
  }
  let node1 = {
    id: 'x2',
    type: 'subflow'
  }
  let node2 = {
    id: 'x3',
    type: '',
    z: 'x'
  }
  let node3 = {
    id: 'x2',
    type: '',
    z: 'x2'
  }
  let node4 = {
    id: 'xss',
    type: '',
  }
  let nodeList = [
    node,
    node1,
    node2,
    node3,
    node4
  ]
  let currentNodes = nodeList
  let newNodes = nodeList
  diff.generateDiff(currentNodes, newNodes)
  // use nightmare
})

test('Diff: resolveDiffs', () => {
  let localDiff = {
    currentConfig: {
      all: ['a', 'b', 'c'],
      added: ['d', 'e']
    },
    newConfig: {
      all: ['a', 'b']
    },
    changed: ['t', 'u'],
    deleted: ['trre', 'eer']
  }
  let remoteDiff = {
    deleted: ['x', 'y'],
    changed: ['t', 'u'],
    added: []
  }
  diff.resolveDiffs(localDiff, remoteDiff)
  // use nightmare
})

test('Diff: showDiff', () => {
  let difference = {
    localDiff: {
      currentConfig: {
        all: ['a', 'b', 'c'],
        added: ['d', 'e'],
        tabOrder: ['aaa', 'bbb'],
        globals: {},
        tabs: ['aaa', 'bb']
      },
      newConfig: {
        all: ['a', 'b'],
        globals: {},
        tabs: ['aa', 'b'],
        tabOrder: ['aa1', 'bb2'],
      },
      changed: ['t', 'u'],
      deleted: ['trre', 'eer']
    },
    remoteDiff: undefined,
    conflicts: [],
    resolutions: []
  }
  diff.showDiff(difference)
  // use nightmare
})

test('Diff: mergeDiff', () => {
  let difference = {
    localDiff: {
      currentConfig: {
        all: ['a', 'b', 'c'],
        added: ['d', 'e']
      },
      newConfig: {
        all: ['a', 'b']
      },
      changed: ['t', 'u'],
      deleted: ['trre', 'eer']
    },
    remoteDiff: {
      deleted: ['x', 'y'],
      changed: ['t', 'u'],
      added: []
    },
    conflicts: [],
    resolutions: []
  }
  diff.mergeDiff(difference)
  // use nightmare
})
test('Diff: buildDiffPanel with out contanier can not create panel', () => {
  let panel;
  let container = null
  try {
    panel = diff.buildDiffPanel(container);
  }
  catch (e) {
    expect(panel).not.toBeDefined();
  }
});

test('Diff: Tray options open', () => {
  if (trayOptions) {
    $("#rad1").data("node-id", 'a');
    trayOptions.open($('#mainTray'));
  }
});
test('Diff: Tray options close', () => {
  if (trayOptions) {
    trayOptions.close();
  }
});
test('Diff: Tray options show', () => {
  if (trayOptions) {
    trayOptions.show();
  }
});
test('Diff: Tray options resize', () => {
  if (trayOptions) {
    trayOptions.resize();
  }
});
test('Diff: can click tray options cancle button', () => {
  if (trayOptions) {
    trayOptions.buttons[0].click();
  }
});

test('Diff: showDiff', () => {
  let difference = {
    localDiff: {
      currentConfig: {
        all: ['a', 'b', 'c'],
        added: ['d', 'e'],
        tabOrder: ['aaa', 'bbb'],
        globals: {},
        tabs: ['aaa', 'bb']
      },
      newConfig: {
        all: ['a', 'b'],
        globals: {},
        tabs: ['aa', 'b'],
        tabOrder: ['aa1', 'bb2'],
      },
      changed: ['t', 'u'],
      deleted: ['trre', 'eer']
    },
    remoteDiff: {
      deleted: ['x', 'y'],
      changed: ['t', 'u'],
      added: []
    },
    conflicts: [],
    resolutions: []
  }
  diff.showDiff(difference)
  // use nightmare
})
test('Diff: can click tray options merge button', () => {
  if (trayOptions) {
    trayOptions.buttons[1].click();
  }
});
test('Diff: mergeDiff', () => {
  let difference = {
    localDiff: {
      currentConfig: {
        all: ['a', 'b', 'c'],
        added: ['d', 'e']
      },
      newConfig: {
        all: ['a', 'b']
      },
      changed: ['t', 'u'],
      deleted: ['trre', 'eer']
    },
    remoteDiff: {
      deleted: ['x', 'y'],
      changed: ['t', 'u'],
      added: [{ id: 'a' }]
    },
    conflicts: ['1', '2', '3', ''],
    resolutions: ['1', '3']
  }
  diff.mergeDiff(difference)
  // use nightmare
})
test('Diff: createNodeConflictRadioBoxes', () => {
  let node = {
    id: 'test.str22trrr',
    type: undefined
  }
  let row = $("#diffRow");
  let localDiv = $("#mainTray");
  let remoteDiv = $("#remoteDiv");
  let propertiesTable = {}
  let hide = true
  let state = {}
  diff.createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)
  $("#node-diff-selectbox-test-str22trrr-props-remote").change();
  $("#node-diff-selectbox-test-str22trrr-props-local").change();
})
test('Diff: createNodeConflictRadioBoxes', () => {
  let node = {
    id: 'test.str',
    type: 'tab'
  }
  let row = $("#diffRow");
  let localDiv = $("#mainTray");
  let remoteDiv = $("#remoteDiv");
  let propertiesTable = false;
  let hide = true
  let state = {}
  diff.createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)
  $("#node-diff-selectbox-test-str-remote").change();
})

test('Diff: createNodeConflictRadioBoxes', () => {
  let node = {
    id: 'test.str.CHK',
    type: 'ta222b'
  }
  let row = $("#diffRow");
  let localDiv = $("#mainTray");
  let remoteDiv = $("#remoteDiv");
  let propertiesTable = true;
  let hide = true
  let state = {}
  diff.createNodeConflictRadioBoxes(node, row, localDiv, remoteDiv, propertiesTable, hide, state)
  $("#node-diff-selectbox-test-str-CHK-props-remote").change();
})
test('Diff: can click diff selectbox', () => {
  $('.node-diff-selectbox').click()
})
test('Diff:showRemoteDiff', () => {
  diff.showRemoteDiff(undefined);
})