import {
  RED,
  readPage,
  ctx,
  Workspaces
} from './imports'
const ctx = {}

function create(ctx) {
  return new Workspaces(ctx)
}

const ctx = Object.assign({
  // menu
}, baseCtx)

let ws
beforeEach(() => {
  ws = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple')
})
test('Workspaces: create', () => {
  expect(ws.activeWorkspace).toBe(0)
})

test('Workspaces: addWorkspace', () => {
  let wsTab = {}
  let skipHistoryEntry = false
  ws.addWorkspace(wsTab, skipHistoryEntry)
  expect(ws.workspace_tabs).toBe(0)
})

test('Workspaces: deleteWorkspace', () => {
  let wsTab = {}
  ws.deleteWorkspace(wsTab)
  expect(ws.workspace_tabs).toBe(0)
})

test('Workspaces: showRenameWorkspaceDialog', () => {
  let id = 'x'
  ws.showRenameWorkspaceDialog(id)
  // expect
})

test('Workspaces: createWorkspaceTabs', () => {
  ws.createWorkspaceTabs()
  expect(ws.workspace_tabs).toBe(0)
})

test('Workspaces: editWorkspace', () => {
  let id = 'x'
  ws.editWorkspace(id)
  expect(ws.workspace_tabs).toBe(0)
})

test('Workspaces: removeWorkspace', () => {
  let wsTab = {}
  ws.removeWorkspace(wsTab)
  expect(ws.workspace_tabs).toBe(0)
})

test('Workspaces: setWorkspaceOrder', () => {
  let order = {}
  ws.setWorkspaceOrder(order)
  expect(ws.workspace_tabs).toBe(0)
})

test('Workspaces: contains - true when exists', () => {
  let id = 'tab1'
  let contained = ws.contains(id)
  expect(contained).toBeTruthy()
})

test('Workspaces: contains - false when not', () => {
  let id = 'unknown'
  let contained = ws.contains(id)
  expect(contained).toBeFalsy()
})

test('Workspaces: count', () => {
  ws.count()
})

test('Workspaces: active', () => {
  ws.active()
})

test('Workspaces: show', () => {
  ws.show(id)
})

test('Workspaces: refresh', () => {
  ws.refresh()
})

test('Workspaces: resize', () => {
  ws.resize()
})
