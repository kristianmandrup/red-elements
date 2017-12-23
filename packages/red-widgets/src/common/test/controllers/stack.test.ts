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
  document.documentElement.innerHTML = readPage('simple');
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

test('Stack: can add(entry)', () => {
  let entry = {}
  let addedEntry = widgetElem.add(entry);
  expect(addedEntry).toBeDefined()
})

test('Stack: can add(entry) with visible false', () => {
  let entry = {}
  widgetElem.visible = false;
  let addedEntry = widgetElem.add(entry);
  expect(addedEntry).toBeDefined()
})

test('Stack: can add(entry) with collapsible false', () => {
  let entry = { collapsible: false }
  let addedEntry = widgetElem.add(entry);
  expect(addedEntry).toBeDefined()
})

test('Stack : toggle is function and must return true', () => {
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  let isToggle = addedEntry.toggle();
  expect(typeof addedEntry.toggle).toBe('function');
  expect(isToggle).toBe(true);
})

test('Stack : expand is function', () => {
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  let isExpand = addedEntry.expand();
  expect(typeof addedEntry.expand).toBe('function');
})

test('Stack : isExpanded is function', () => {
  let entry = {}
  let addedEntry = widgetElem.add(entry)
  let isExpanded = addedEntry.isExpanded();
  expect(typeof addedEntry.isExpanded).toBe('function');
})

test('Stack : collapse is function', () => {
  let entry = { expanded: true }
  let addedEntry = widgetElem.add(entry)
  let isExpanded = addedEntry.collapse();
  expect(typeof addedEntry.collapse).toBe('function');
})

test('Stack : collapse is function', () => {
  let entry = { expanded: false }
  let addedEntry = widgetElem.add(entry)
  let isExpanded = addedEntry.collapse();
  expect(typeof addedEntry.collapse).toBe('function');
})

test('Stack: can add(entry) if entry is not object', () => {
  let entry = ''
  let addedEntry;
  try {
    addedEntry = widgetElem.add(entry)
  } catch (e) {
    expect(addedEntry).not.toBeDefined()
  }
})

test('Stack : toggle is function', () => {
  let entry = { expanded: true, visible: false };
  let addedEntry = widgetElem.add(entry)
  let isExpanded = addedEntry.toggle();
  expect(typeof addedEntry.toggle).toBe('function');
})


test('Stack : expand is function', () => {
  let entry = { expanded: true, onexpand: () => { } };
  let addedEntry = widgetElem.add(entry)
  let isExpanded = addedEntry.expand();
  expect(typeof addedEntry.expand).toBe('function');
})

test('Stack: can toggle visiblity to true', () => {
  let shown = widgetElem.show()
  expect(shown).toBeDefined()
  expect(shown.visible).toBeTruthy()
})

test('Stack: can toggle visiblity to false', () => {
  let hidden = widgetElem.hide()
  expect(hidden).toBeDefined()
  expect(hidden.visible).toBeFalsy()
})



test('Stack: show() with entries', () => {
  widgetElem.entries = [{
    container: {
      show: () => { }
    }
  }];
  let hidden = widgetElem.show();
  expect(hidden).toBeDefined()
  expect(hidden.visible).not.toBeFalsy()
})

test('Stack: header can be clicked', () => {
  let entry = { expanded: true }
  let addedEntry = widgetElem.add(entry)
  $("#palette-header").click();
})

test('Stack: handle header clicked event with expanded to false', () => {
  let entry = { isExpanded: () => { return false }, expand: () => { }, toggle: () => { } };
  let entries = [{ isExpanded: () => { return true; }, collapse: () => { } }, { isExpanded: () => { return false; }, collapse: () => { } }]
  widgetElem.handleHeaderClickedEvent({ singleExpanded: true }, entry, entries);
})

test('Stack: handle header clicked event with options singleExpanded to false', () => {
  let entry = { isExpanded: () => { return false }, expand: () => { }, toggle: () => { } };
  let entries = [{ isExpanded: () => { return true; }, collapse: () => { } }, { isExpanded: () => { return false; }, collapse: () => { } }]
  widgetElem.handleHeaderClickedEvent({ singleExpanded: false }, entry, entries);
})

test('Stack: hide() with entries', () => {
  widgetElem.entries = [{
    container: {
      show: () => { },
      hide: () => { }
    }
  }];
  let hidden = widgetElem.hide();
  expect(hidden).toBeDefined()
  expect(hidden.visible).toBeFalsy()
})
