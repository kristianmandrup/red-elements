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
  // document.documentElement.innerHTML = readPage('workspaces', __dirname)
  document.documentElement.innerHTML = readPage('simple')
})

function addFakeTabs() {
  ws.workspace_tabs.addTab = (tabsId) => {
    ws.tabs.ids.push(tabsId.id);
  };
}

function removeTabFake() {
  ws.workspace_tabs.removeTab = (id) => {
    const index = ws.tabs.ids.findIndex(x => x === id);
    if (index > -1) {
      ws.tabs.ids.splice(index, 1);
    }
  }
}

test('Workspaces: create', () => {
  expect(ws.activeWorkspace).toBeDefined()
  expect(ws.workspace_tabs).toBeDefined()
})


test('tabs', () => {
  let tabs = ws.tabs
  expect(tabs).toEqual({});
})

test('tabs - when have tabs, not empty', () => {
  let tabs = ws.tabs
  let id = 'tab1'
  let wsTab = {
    id
  }
  ws.addWorkspace(wsTab)
  expect(tabs).not.toBeEmpty()
})

test('tabIds - no tabs then no ids', () => {
  let ids = ws.tabIds
  expect(ids).toBe(undefined)
})

test('tabIds', () => {
  let id = 'tab1'
  let wsTab = {
    id
  }
  ws.tabs.ids = [];
  addFakeTabs();
  ws.addWorkspace(wsTab)
  let ids = ws.tabIds;
  expect(ids).toContain(id)
})

test('hasTabId - no tabs, has none matching on id', () => {
  let id = 'tab1'
  ws.tabs.ids = ['tab2']
  expect(ws.hasTabId('tab1')).toBeFalsy()
})


test('hasTabId - found when has tab with matching id', () => {
  let id = 'tab1'
  let wsTab = {
    id
  }
  ws.tabs.ids = [];
  addFakeTabs();
  ws.addWorkspace(wsTab)
  expect(ws.hasTabId(id)).toBeTruthy()
})

test('Workspaces: addWorkspace', () => {
  let wsTab = {
    id: 'tab1'
  }
  ws.tabs.ids = [];
  addFakeTabs();
  let skipHistoryEntry = false
  ws.addWorkspace(wsTab, skipHistoryEntry)
  expect(ws.hasTabId('tab1')).toBeTruthy()
})

test('Workspaces: deleteWorkspace', () => {
  let wsTab = {
    id: 'tab1'
  }
  ws.tabs.ids = [];
  addFakeTabs();
  ws.addWorkspace(wsTab)
  removeTabFake();
  expect(ws.hasTabId('tab1')).toBeTruthy()
  ws.deleteWorkspace(wsTab.id)

  expect(ws.hasTabId('tab1')).toBeFalsy()
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
  ws.tabs.ids = [];
  addFakeTabs();
  ws.addWorkspace(wsTab)
  expect(ws.hasTabId('tab1')).toBeTruthy()
  removeTabFake();
  ws.removeWorkspace(wsTab.id)
  expect(ws.hasTabId('tab1')).toBeFalsy()
})

test('Workspaces: setWorkspaceOrder', () => {

  ws.tabs.ids = [];
  addFakeTabs();
  ws.addWorkspace({
    id: 'tab2'
  })
  ws.addWorkspace({
    id: 'tab1'
  })
  let order = ['tab1', 'tab2']
  ws.workspace_tabs.order = (ordr) => {
    let sortedArray = [];
    ordr.forEach(data => {
      sortedArray.push(data);
    });
    ws.workspace_tabs.existingTabMap = sortedArray;
  }
  ws.setWorkspaceOrder(order)
  const orderMap = ws.workspace_tabs.existingTabMap
  log({
    orderMap
  })
  expect(orderMap[0]).toBe('tab1')
})

test('Workspaces: contains - true when exists', () => {
  let id = 'tab1'
  ws.tabs.ids = [];
  addFakeTabs();
  ws.addWorkspace({
    id
  })
  let contained = ws.tabIds.find(x => x.id === id);
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
