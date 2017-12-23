import {
  RED,
  readPage,
  Workspaces
} from './imports'

function create() {
  return new Workspaces()
}

const { log } = console

let ws
beforeEach(() => {
  ws = create()
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple')
})

test('Workspaces: create', () => {
  expect(ws.activeWorkspace).toBeDefined()
  expect(ws.workspace_tabs).toBeDefined()
})

test('Workspaces: addWorkspace', () => {
  let wsTab = {
    id: 'tab1'
  }
  let skipHistoryEntry = false
  ws.addWorkspace(wsTab, skipHistoryEntry)
  expect(ws.hasTabId('tab1')).toBeTruthy()
})

test('Workspaces: deleteWorkspace', () => {
  let wsDel = create()
  let wsTab = {
    id: 'tab1'
  }
  wsDel.addWorkspace(wsTab)
  expect(wsDel.hasTabId('tab1')).toBeTruthy()

  wsDel.deleteWorkspace(wsTab)

  expect(wsDel.hasTabId('tab1')).toBeFalsy()
})

test('Workspaces: showRenameWorkspaceDialog', () => {
  let id = 'tab1'
  expect(ws.showRenameWorkspaceDialog(id)).toBeDefined()

})

test('Workspaces: createWorkspaceTabs', () => {
  expect(ws.createWorkspaceTabs()).toBeDefined()
  expect(ws.workspace_tabs).toBeDefined()
  expect(ws.workspace_tabs.tabs).toBeDefined()
})

// calls: showRenameWorkspaceDialog with id or activeWorkspace
test('Workspaces: editWorkspace', () => {
  let id = 'x'
  expect(ws.editWorkspace(id)).toBeDefined()
})

test('Workspaces: editWorkspace default: activeWorkspace', () => {
  expect(ws.editWorkspace()).toBeDefined()
})

test('Workspaces: removeWorkspace', () => {
  let wsTab = {
    id: 'tab1'
  }
  ws.addWorkspace(wsTab)
  expect(ws.hasTabId('tab1')).toBeTruthy()
  ws.removeWorkspace(wsTab)
  expect(ws.hasTabId('tab1')).toBeFalsy()
})

// TODO: FIX
// Please see order method on Tabs. Needs complete refactoring using internal structure
test.only('Workspaces: setWorkspaceOrder', () => {
  let wsOrder = create()

  wsOrder.addWorkspace({
    id: 'tab2'
  })
  wsOrder.addWorkspace({
    id: 'tab1'
  })

  let order = ['tab1', 'tab2']
  wsOrder.setWorkspaceOrder(order)
  const orderMap = wsOrder.workspace_tabs.existingTabMap
  log({
    orderMap
  })
  expect(orderMap[0].id).toBe('tab1')
})

test('Workspaces: contains - true when exists', () => {
  let id = 'tab1'
  ws.addWorkspace({
    id
  })
  let contained = ws.contains(id)
  expect(contained).toBeTruthy()
})

test('Workspaces: contains - false when not', () => {
  let id = 'unknown'
  ws.addWorkspace({
    id: 'tab1'
  })
  let contained = ws.contains(id)
  expect(contained).toBeFalsy()
})

test('Workspaces: count - adds one after workspace added', () => {
  const wsCount = create()
  log({
    tabIds: wsCount.tabIds
  })
  expect(wsCount.count()).toBe(0)
  wsCount.addWorkspace({
    id: 'tab1'
  })
  expect(wsCount.count()).toBe(1)
})

test('Workspaces: active - with no workspace returns 0', () => {
  expect(ws.activeWorkspace).toBe(0)
  let active = ws.active()
  expect(active).toBe(ws.activeWorkspace)
  expect(active).toBe(0)
})

test('Workspaces: active - with activeWorkspace returns active workspace index', () => {
  expect(ws.activeWorkspace).toBe(0)
  ws.addWorkspace({
    id: 'tab1'
  })
  ws.addWorkspace({
    id: 'tab2'
  })
  expect(ws.activeWorkspace).toBe(0)

  let active = ws.active()
  expect(active).toBe(ws.activeWorkspace)
})

test('Workspaces: show - ignore if not exist', () => {
  const id = 'tab3'
  const wsShow = create()
  wsShow.addWorkspace({
    id
  })
  let shown = wsShow.show('unknown')
  expect(shown).toBe(wsShow)
})

test('Workspaces: show - activate when exists', () => {
  const id = 'tab3'
  const wsShow = create()
  wsShow.addWorkspace({
    id
  })
  let shown = wsShow.show(id)
  expect(shown).toBe(wsShow)
})

test('Workspaces: refresh', () => {
  let refreshed = ws.refresh()
  expect(refreshed).toBe(ws)
})

test('Workspaces: resize', () => {
  let resized = ws.resize()
  expect(resized).toBe(ws)
})
