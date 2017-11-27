import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Stack
} = controllers

const clazz = Stack

const {
  log
} = console

beforeAll(() => {
  // Popover has no widget factory, just a class

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

let widgetElem

beforeEach(() => {
  widgetElem = new Stack({
    container: $('#stack')
  })
})

test('Stack: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Stack: widget can NOT be created without container elem', () => {
  try {
    let badElem = new Stack({})
    expect(badElem).not.toBeDefined()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('Stack: widget can be created from target elem', () => {
  expect(widgetElem).toBeDefined()
})

test('Stack: add(entry)', () => {
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  expect(addedEntry).toBeDefined()
})

test('Stack : toggle is function and must return true',()=>
{
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  let isToggle=addedEntry.toggle();
  expect(typeof addedEntry.toggle).toBe('function');
  expect(isToggle).toBe(true)  ;
})

test('Stack : expand is function',()=>
{
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  let isExpand=addedEntry.expand();
  expect(typeof addedEntry.expand).toBe('function');
})

test('Stack : isExpanded is function',()=>
{
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  let isExpanded=addedEntry.isExpanded();
  expect(typeof addedEntry.isExpanded).toBe('function');
})

test('Stack : collapse is function',()=>
{
  let entry = {expanded:true}
  let addedEntry = widgetElem.add(entry)
  let isExpanded=addedEntry.collapse();
  expect(typeof addedEntry.collapse).toBe('function');
})

test('Stack: add(entry) if entry is not object', () => {
  let entry = ''
  let addedEntry;
  try {
    addedEntry = widgetElem.add(entry)
  } catch (e) {
    expect(addedEntry).not.toBeDefined()
  }
})

test('Stack: show()', () => {
  let shown = widgetElem.show()
  expect(shown).toBeDefined()
  expect(shown.visible).toBeTruthy()
})

test('Stack: hide()', () => {
  let hidden = widgetElem.hide()
  expect(hidden).toBeDefined()
  expect(hidden.visible).toBeFalsy()
})
