import {
  TypeSearch
} from './imports'
const ctx = {}

function create(ctx) {
  return new TypeSearch(ctx)
}

let ts
beforeEach(() => {
  ts = new TypeSearch(ctx)
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

test('TypeSearch: createDialog', () => {
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
  ts.handleMouseActivity(evt)
  // use nightmare
})

test('TypeSearch: show', () => {
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
