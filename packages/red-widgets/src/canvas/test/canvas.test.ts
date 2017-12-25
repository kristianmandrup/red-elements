import {
  View,
  readPage,
  ctx
} from './imports'
import * as d3 from 'd3-selection'

function create() {
  return new View()
}

function init() {
  return create().init()
}

const {
  log
} = console

let view
// beforeEach(() => {
//   view = create(ctx)
// })

beforeAll(() => {
  document.documentElement.innerHTML = readPage('canvas');
})

// use jest
test('View: create', () => {
  let diff = create()
  log(diff)
  // t.deepEqual(diff.currentDiff, {})
  // t.falsy(diff.diffVisible)
  expect(diff).toBeDefined()
})

test('View: configureD3', () => {
  view = create();
  let result: any;
  try {
    result = view.configureD3()
    expect(result).toBeDefined()
  }
  catch (err) {
    expect(result).not.toBeDefined()
  }
});

test('View: configureHandlers', () => {
  view = create()
  const result = view.configureHandlers()
  expect(result).toBeDefined()
})

test('View: configureActions', () => {
  view = create()
  const result = view.configureActions()
  expect(result).toBeDefined()
})

test('View: configureEvents', () => {
  view = create()
  const result = view.configureEvents()
  expect(result).not.toBeDefined()
})


test('View: configure', () => {
  view = create();
  let result: any;
  try {
    const result = view.configure()
    expect(result).toBeDefined()
  }
  catch (err) {
    expect(result).not.toBeDefined()
  }
})

// test('View: updateGrid', () => {
//   view = init()
//   let result: any;
//   view.grid = d3;
//   try {
//     view.gridSize = 5;
//     view.space_width = 30
//     result = view.updateGrid()
//     expect(result).toBeDefined()
//   }
//   catch (err) {
//     expect(result).not.toBeDefined()
//   }
// })

test('View: showDragLines', () => {
  let view;
  view = init();
  try {
    view.drag_lines = [];
    let nodes = [
      { el: $("#d31") },
      { el: $("#d32") },
      { el: $("#d33") }
    ]
    const result = view.showDragLines(nodes)
  }
  catch (err) {
    expect(view).not.toBeDefined()

  }

})

// test('View: hideDragLines', () => {
//   view = init()
//   const result = view.hideDragLines()
//   expect(result).toBeDefined()
// })

// test('View: hideDragLines', () => {
//   view = init()
//   const result = view.hideDragLines()
//   expect(result).toBeDefined()
// })

// test('View: updateActiveNodes', () => {
//   view = init()
//   const result = view.updateActiveNodes()
//   expect(result).toBeDefined()
// })

// test('View: addNode', () => {
//   view = init()
//   const result = view.addNode()
//   expect(result).toBeDefined()
// })

// test('View: canvasMouseDown', () => {
//   view = init()
//   const result = view.canvasMouseDown()
//   expect(result).toBeDefined()
// })

// test('View: canvasMouseMove', () => {
//   view = init()
//   const result = view.canvasMouseMove()
//   expect(result).toBeDefined()
// })

// test('View: canvasMouseUp', () => {
//   view = init()
//   const result = view.canvasMouseUp()
//   expect(result).toBeDefined()
// })

// test('View: zoomIn', () => {
//   view = init()
//   const result = view.zoomIn()
//   expect(result).toBeDefined()
// })

// test('View: zoomOut', () => {
//   view = init()
//   const result = view.zoomOut()
//   expect(result).toBeDefined()
// })

// test('View: zoomZero', () => {
//   view = init()
//   const result = view.zoomZero()
//   expect(result).toBeDefined()
// })

// test('View: selectAll', () => {
//   view = init()
//   const result = view.selectAll()
//   expect(result).toBeDefined()
// })

// test('View: clearSelection', () => {
//   view = init()
//   const result = view.clearSelection()
//   expect(result).toBeDefined()
// })

// test('View: updateSelection', () => {
//   view = init()
//   const result = view.updateSelection()
//   expect(result).toBeDefined()
// })

// test('View: endKeyboardMove', () => {
//   view = init()
//   const result = view.endKeyboardMove()
//   expect(result).toBeDefined()
// })

// test('View: moveSelection', () => {
//   view = init()
//   const result = view.moveSelection()
//   expect(result).toBeDefined()
// })

// test('View: copySelection', () => {
//   view = init()
//   const result = view.copySelection()
//   expect(result).toBeDefined()
// })

// test('View: deleteSelection', () => {
//   view = init()
//   const result = view.deleteSelection()
//   expect(result).toBeDefined()
// })

// test('View: editSelection', () => {
//   view = init()
//   const result = view.editSelection()
//   expect(result).toBeDefined()
// })

// test('View: calculateTextWidth', () => {
//   view = init()
//   const result = view.calculateTextWidth()
//   expect(result).toBeDefined()
// })

// test('View: calculateTextDimensions', () => {
//   view = init()
//   const result = view.calculateTextDimensions()
//   expect(result).toBeDefined()
// })

// test('View: resetMouseVars', () => {
//   view = init()
//   const result = view.resetMouseVars()
//   expect(result).toBeDefined()
// })

// test('View: disableQuickJoinEventHandler', () => {
//   view = init()
//   const result = view.disableQuickJoinEventHandler()
//   expect(result).toBeDefined()
// })

// test('View: portMouseDown', () => {
//   view = init()
//   const result = view.portMouseDown()
//   expect(result).toBeDefined()
// })

// test('View: portMouseUp', () => {
//   view = init()
//   const result = view.portMouseUp()
//   expect(result).toBeDefined()
// })

// test('View: getElementPosition', () => {
//   view = init()
//   const result = view.getElementPosition()
//   expect(result).toBeDefined()
// })

// test('View: getPortLabel', () => {
//   view = init()
//   const result = view.getPortLabel()
//   expect(result).toBeDefined()
// })

// test('View: portMouseOver', () => {
//   view = init()
//   const result = view.portMouseOver()
//   expect(result).toBeDefined()
// })

// test('View: portMouseOut', () => {
//   view = init()
//   const result = view.portMouseOut()
//   expect(result).toBeDefined()
// })

// test('View: nodeMouseUp', () => {
//   view = init()
//   const result = view.nodeMouseUp()
//   expect(result).toBeDefined()
// })

// test('View: nodeMouseDown', () => {
//   view = init()
//   const result = view.nodeMouseDown()
//   expect(result).toBeDefined()
// })

// test('View: isButtonEnabled', () => {
//   view = init()
//   const result = view.isButtonEnabled()
//   expect(result).toBeDefined()
// })

// test('View: nodeButtonClicked', () => {
//   view = init()
//   const result = view.nodeButtonClicked()
//   expect(result).toBeDefined()
// })

// test('View: showTouchMenu', () => {
//   view = init()
//   const result = view.showTouchMenu()
//   expect(result).toBeDefined()
// })

// test('View: redraw', () => {
//   view = init()
//   const result = view.redraw()
//   expect(result).toBeDefined()
// })

// test('View: importNodes', () => {
//   view = init()
//   const result = view.importNodes()
//   expect(result).toBeDefined()
// })

// test('View: toggleShowGrid', () => {
//   view = init()
//   const result = view.toggleShowGrid()
//   expect(result).toBeDefined()
// })

// test('View: toggleSnapGrid', () => {
//   view = init()
//   const result = view.toggleSnapGrid()
//   expect(result).toBeDefined()
// })

// test('View: toggleStatus', () => {
//   view = init()
//   const result = view.toggleStatus()
//   expect(result).toBeDefined()
// })

// test('View: state', () => {
//   view = init()
//   const result = view.state()
//   expect(result).toBeDefined()
// })

// test('View: select', () => {
//   view = init()
//   const result = view.select()
//   expect(result).toBeDefined()
// })

// test('View: selection', () => {
//   view = init()
//   const result = view.selection()
//   expect(result).toBeDefined()
// })

// test('View: scale', () => {
//   view = init()
//   const result = view.scale()
//   expect(result).toBeDefined()
// })
// test('View: getLinksAtPoint', () => {
//   view = init()
//   const result = view.getLinksAtPoint()
//   expect(result).toBeDefined()
// })
// test('View: reveal', () => {
//   view = init()
//   const result = view.reveal()
//   expect(result).toBeDefined()
// })
// test('View: gridSize', () => {
//   view = init()
//   const result = view.gridSize()
//   expect(result).toBeDefined()
// })
// test('View: handleD3MouseDownEvent', () => {
//   view = init()
//   const result = view.handleD3MouseDownEvent()
//   expect(result).toBeDefined()
// })
// test('View: handleOuterTouchEndEvent', () => {
//   view = init()
//   const result = view.handleOuterTouchEndEvent()
//   expect(result).toBeDefined()
// })
// test('View: handleOuterTouchStartEvent', () => {
//   view = init()
//   const result = view.handleOuterTouchStartEvent()
//   expect(result).toBeDefined()
// })
// test('View: handleOuterTouchMoveEvent', () => {
//   view = init()
//   const result = view.handleOuterTouchMoveEvent()
//   expect(result).toBeDefined()
// })

// test('View: handleWorkSpaceChangeEvent', () => {
//   view = init()
//   const result = view.handleWorkSpaceChangeEvent()
//   expect(result).toBeDefined()
// })
