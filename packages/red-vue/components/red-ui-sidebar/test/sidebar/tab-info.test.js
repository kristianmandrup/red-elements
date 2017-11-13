const nightmare = require('../nightmare')
import test from 'ava'
import {
  Tip,
  SidebarTabInfo
} from './ui'

const ctx = {}

function createTip(ctx) {
  return new Tip(ctx)
}

function create(ctx) {
  return new SidebarTabInfo(ctx)
}

test('Tip: create', () => {
  let tip = createTip(ctx)
  t.truthy(tip.enabled)
})

test('Tip: setTip', () => {
  let tip = createTip(ctx)
  tip.setTip()
  // use nightmare to test UI
})

test('Tip: cycleTips', () => {
  let tip = createTip(ctx)
  tip.cycleTips()
  // use nightmare to test UI
})

test('Tip: startTips', () => {
  let tip = createTip(ctx)
  tip.startTips()
  // use nightmare to test UI
})

test('Tip: stopTips', () => {
  let tip = createTip(ctx)
  tip.stopTips()
  // use nightmare to test UI
})

test('Tip: nextTip', () => {
  let tip = createTip(ctx)
  tip.nextTip()
  // use nightmare to test UI
})

test('Sidebar TabInfo: create', () => {
  let tabInfo = create(ctx)
  t.is(typeof tabInfo.tips, 'object')
  // use nightmare to test UI
})

test('TabInfo: show', () => {
  let tabInfo = create(ctx)
  tabInfo.show()
  // use nightmare to test UI
})

test('TabInfo: jsonFilter', () => {
  let tabInfo = create(ctx)
  tabInfo.jsonFilter(key, value)
})

test('TabInfo: addTargetToExternalLinks', () => {
  let tabInfo = create(ctx)
  let element = $('#target')
  tabInfo.addTargetToExternalLinks(element)
})

test('TabInfo: refresh', () => {
  let tabInfo = create(ctx)
  let node = {}
  tabInfo.refresh(node)
})

test('TabInfo: setInfoText', () => {
  let tabInfo = create(ctx)
  let node = {}
  tabInfo.setInfoText(infoText)
})

test('TabInfo: clear', () => {
  let tabInfo = create(ctx)
  tabInfo.clear()
})

test('TabInfo: set', () => {
  let tabInfo = create(ctx)
  let html = '<b>hello</b>'
  tabInfo.set(html)
})
