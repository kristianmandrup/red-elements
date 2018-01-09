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

const { log } = console

function fakeNode(override = {}, def = true) {
  let base: any = {
    id: 'x',
    in: {},
    out: {},
    type: 'subflow'
  }

  if (def) {
    base._def = {
      credentials: {},
      defaults: {},
      set: {
        module: 'node-red'
      }
    }
  }

  return Object.assign(base, override)
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
  const formatted = utils.formatNumber(element, obj, sourceId, path, cycle, initialFormat)
  expect(formatted).toBe(utils)
})

test('Utils: formatBuffer(element, button, sourceId, path, cycle)', () => {
  const element = $('<div/>')
  const button = $('<button>Click me</button>')
  const sourceId = 'x'
  const path = 'abc'
  const cycle = 0
  const farmatted = utils.formatBuffer(element, button, sourceId, path, cycle)
  expect(farmatted).toBe(utils)
})

test('Utils: buildMessageElement(obj, options)', () => {
  const obj = {}
  const options = {}
  const msgElem = utils.buildMessageElement(obj, options)
  const classes = msgElem.attr('class').split(/\s+/)
  const html = msgElem.html()
  const id = msgElem.attr('id')
  const text = msgElem.text()
  log({
    id,
    html,
    text,
    msgElem,
    classes
  })

  expect(html).toEqual('<span class="debug-message-row"><span class="debug-message-object-value"><span class="debug-message-object-header"><span>{ </span><span class="debug-message-type-meta">empty</span><span> }</span></span></span></span>')
  expect(text).toEqual('{ empty }')
  expect(id).toBeUndefined()
  expect(classes).toEqual(['debug-message-element',
    'debug-message-top-level',
    'collapsed'])
})

test('Utils: normalisePropertyExpression(str)', () => {
  const str = 'abc'
  const normalized = utils.normalisePropertyExpression(str)
  expect(normalized).toEqual([str])
})

test('Utils: validatePropertyExpression(str)', () => {
  const str = 'abc'
  const validated = utils.validatePropertyExpression(str)
  expect(validated).toBe(true)
})

test('Utils: getMessageProperty(msg, expr) - str expr', () => {
  const msg = {
    hello: 'hello my friend'
  }
  const expr = 'msg.hello' // use hello
  const msgProp = utils.getMessageProperty(msg, expr)
  expect(msgProp).toEqual('hello my friend')
})

test.only('Utils: getMessageProperty(msg, expr) - array expr', () => {
  const msg = {
    hello: 'hello my friend'
  }
  const expr = ['hello']
  const msgProp = utils.getMessageProperty(msg, expr)
  expect(msgProp).toEqual('hello my friend')
})


test.only('Utils: getMessageProperty(msg, expr) - data expr', () => {
  const msg = {
    type: 'message',
    data: {
      hello: 'hello my friend'
    },
    length: 10
  }
  const expr = ['hello']
  const msgProp = utils.getMessageProperty(msg, expr)
  expect(msgProp).toEqual('hello my friend')
})


test('Utils: getNodeIcon(def, node)', () => {
  const def = {
    category: 'config',
    icon: 'arrow'
  }
  const node = {}
  const msgProp = utils.getNodeIcon(def, node)
  expect(msgProp).toBe("icons/node-red/cog.png")
})

test('Utils: getNodeLabel(node, defaultLabel)', () => {
  const node = fakeNode({
    id: 'x',
    label: 'hello'
  })
  const defaultLabel = 'hello'
  const label = utils.getNodeLabel(node, defaultLabel)
  expect(label).toBe(label)
})
