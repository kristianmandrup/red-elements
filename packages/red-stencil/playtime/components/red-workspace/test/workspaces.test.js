const nightmare = require('../nightmare')
import test from 'ava'
import {
  Workspaces
} from './ui'
const ctx = {}

function create(ctx) {
  return new Workspaces(ctx)
}

test('Workspaces: create', () => {
  let ws = create(ctx)
  t.is(ws.activeWorkspace, 0)
})

test('Workspaces: addWorkspace', () => {
  let ws = create(ctx)
  let wsTab = {}
  let skipHistoryEntry = false
  ws.addWorkspace(wsTab, skipHistoryEntry)
  // t.is(ws.workspace_tabs ...)
})

test('Workspaces: deleteWorkspace', () => {
  let ws = create(ctx)
  let wsTab = {}
  ws.deleteWorkspace(wsTab)
})

test('Workspaces: showRenameWorkspaceDialog', () => {
  let ws = create(ctx)
  let id = 'x'
  ws.showRenameWorkspaceDialog(id)
})

test('Workspaces: createWorkspaceTabs', () => {
  let ws = create(ctx)
  ws.createWorkspaceTabs()
})

test('Workspaces: editWorkspace', () => {
  let ws = create(ctx)
  let id = 'x'
  ws.editWorkspace(id)
})

test('Workspaces: removeWorkspace', () => {
  let ws = create(ctx)
  let wsTab = {}
  ws.removeWorkspace(wsTab)
})

test('Workspaces: setWorkspaceOrder', () => {
  let ws = create(ctx)
  let order = {}
  ws.setWorkspaceOrder(order)
})

test('Workspaces: contains', () => {
  let ws = create(ctx)
  let id = 'x'
  ws.contains(id)
})

test('Workspaces: count', () => {
  let ws = create(ctx)
  ws.count()
})

test('Workspaces: active', () => {
  let ws = create(ctx)
  ws.active()
})

test('Workspaces: show', () => {
  let ws = create(ctx)
  ws.show(id)
})

test('Workspaces: refresh', () => {
  let ws = create(ctx)
  ws.refresh()
})

test('Workspaces: resize', () => {
  let ws = create(ctx)
  ws.resize()
})
