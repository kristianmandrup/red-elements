import {
  TypeSearch,
  Searchbox,
  EditableList
} from './imports'
import {
  default as i18n
} from 'i18next'

const path = require('path');
const {
  log
} = console

// const translate = i18n.t
const translate = (label) => label

const ctx = {
  _: translate
}

jest
  .dontMock('fs')
  .dontMock('jquery')

const $ = require('jquery');
const fs = require('fs')

global.$ = $
// log({
//   $: global.$
// })

global.jQuery = global.$
require('jquery-ui-dist/jquery-ui')

function create(ctx) {
  return new TypeSearch(ctx)
}

let ts
beforeEach(() => {
  ts = new TypeSearch(ctx)
})

function readPage(name) {
  const filePath = path.join(__dirname, `./app/${name}.html`)

  return fs.readFileSync(filePath).toString();
}

const html = readPage('simple')

let RED = {

}

beforeAll(() => {
  Searchbox(RED)
  EditableList(RED)

  document.documentElement.innerHTML = html
})

test('TypeSearch: create', () => {
  expect(ts.disabled).toBeFalsy()
})

test('TypeSearch: search', () => {
  let val = 'x'
  ts.search(val)
  // updates UI with search result

  // use nightmare
})

test('TypeSearch: ensureSelectedIsVisible', () => {
  ts.ensureSelectedIsVisible()
  // use nightmare
})

test.only('TypeSearch: createDialog', () => {
  ts.createDialog()
  // use nightmare
})

test('TypeSearch: confirm', () => {
  let def = {}
  ts.confirm(def)
  // use nightmare
})

test('TypeSearch: handleMouseActivity', () => {
  let def = {}
  let evt = (ev) => {
    console.log({
      ev
    })
  }
  ts.handleMouseActivity(evt)
  // use nightmare
})

test('TypeSearch: show', () => {
  let _ctx = Object.assign({
    keyboard: {
      add() {

      }
    }

  }, ctx)
  ts = create(_ctx)
  let opts = {}
  ts.show(opts)
  // use nightmare
})

test('TypeSearch: hide', () => {
  let opts = {}
  let fast = 'x'
  ts.hide(fast)
  // use nightmare
})

test('TypeSearch: getTypeLabel', () => {
  let opts = {}
  let type = 'x'
  let def = {}
  ts.getTypeLabel(type, def)
  // use nightmare
})

test('TypeSearch: refreshTypeList', () => {
  ts.refreshTypeList()
  // use nightmare
})
