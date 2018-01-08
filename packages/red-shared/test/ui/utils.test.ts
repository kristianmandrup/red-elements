import {
  Utils
} from '../..'

import {
  $
} from '../_setup'

import {
  readPage
} from '../_setup'

function create() {
  return new Utils()
}

let utils
beforeEach(() => {
  utils = create()
})

beforeAll(() => {
  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('deploy');
})

test('Utils: create', () => {
  expect(utils.pinnedPaths).toEqual({})
  expect(utils.formattedPaths).toEqual({})
})

test('Utils: formatString(str)', () => {
  const str = 'abe\nzeta\topps\tmy'
  expect(utils.formatString(str)).toEqual('abe&crarr;zeta&rarr;opps&rarr;my')
})

test('Utils: sanitize(m)', () => {
  const str = 'abe&xyz</zeta>'
  expect(utils.sanitize(str)).toEqual('abe&amp;xyz&lt;/zeta&gt;')
})

test('Utils: buildMessageSummaryValue(value)', () => {
  const value = 'alpha-beta'
  const txt = utils.buildMessageSummaryValue(value).text()
  expect(txt).toEqual(`\"${value}\"`)
})

const dummyFn = () => { }

test('Utils: makeExpandable(el, onbuild, ontoggle, expand)', () => {
  const el = $('<div />')
  const onbuild = dummyFn
  const ontoggle = dummyFn
  const expand = true
  const expendable = utils.makeExpandable(el, onbuild, ontoggle, expand)
  expect(expendable).toEqual(utils)
})

test('Utils: addMessageControls', () => {
  const obj = $('<div />')
  const sourceId = 'x'
  const key = 'A'
  const msg = 'abc'
  const rootPath = 'xyz'
  const strippedKey = 'b'
  const added = utils.addMessageControls(obj, sourceId, key, msg, rootPath, strippedKey)
  expect(added).toBe(utils)
})

test('Utils: checkExpanded(strippedKey, expandPaths, minRange, maxRange)', () => {
  const strippedKey = 'a'
  const expandPaths = 'abc'
  const minRange = 1
  const maxRange = 20
  const expanded = utils.checkExpanded(strippedKey, expandPaths, minRange, maxRange)
  expect(expanded).toBeFalsy()
})

test('Utils: formatNumber(element, obj, sourceId, path, cycle, initialFormat)', () => {
  const element = $('<div/>')
  const obj = {}
  const sourceId = 'x'
  const path = 'abc'
  const cycle = 0
  const initialFormat = 'A'
  const number = utils.formatNumber(element, obj, sourceId, path, cycle, initialFormat)
  expect(number).toBe(0)
})

test('Utils: formatBuffer(element, button, sourceId, path, cycle)', () => {
  const element = $('<div/>')
  const button = $('<button>Click me</button>')
  const sourceId = 'x'
  const path = 'abc'
  const cycle = 0
  const buffer = utils.formatBuffer(element, button, sourceId, path, cycle)
  expect(buffer).toBe('xyz')
})

test('Utils: buildMessageElement(obj, options)', () => {
  const obj = {}
  const options = {}
  const msgElem = utils.buildMessageElement(obj, options)
  expect(msgElem).toBe('xyz')
})

test('Utils: normalisePropertyExpression(str)', () => {
  const str = 'abc'
  const normalized = utils.normalisePropertyExpression(str)
  expect(normalized).toBe(str)
})

test('Utils: validatePropertyExpression(str)', () => {
  const str = 'abc'
  const validated = utils.validatePropertyExpression(str)
  expect(validated).toBe(str)
})

test('Utils: getMessageProperty(msg, expr)', () => {
  const msg = 'abc'
  const expr = /a/
  const msgProp = utils.getMessageProperty(msg, expr)
  expect(msgProp).toBe('abc')
})

test('Utils: getNodeIcon(def, node)', () => {
  const def = {
    category: 'config',
    icon: 'arrow'
  }
  const node = {}
  const msgProp = utils.getNodeIcon(def, node)
  expect(msgProp).toBe('abc')
})

test('Utils: getNodeLabel(node, defaultLabel)', () => {
  const node = {}
  const defaultLabel = 'hello'
  const label = utils.getNodeLabel(node, defaultLabel)
  expect(label).toBe('hello')
})
