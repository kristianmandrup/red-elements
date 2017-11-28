import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  EditableList
} = controllers

const clazz = EditableList

const {
  log
} = console

beforeAll(() => {
  // create jquery UI widget via factory (ie. make available on jQuery elements)
  EditableList(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})


test('EditableList: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('EditableList: widget can be created', () => {
  let elem = $('<div></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable"
  }
  let widgetElem = elem.editableList(options)
  // log({
  //   widgetElem
  // })

  expect(widgetElem).toBeDefined()
})
// * options:
// *   - addButton : boolean|string - text for add label, default 'add'
// *   - height : number|'auto'
// *   - resize : function - called when list as a whole is resized
// *   - resizeItem : function(item) - called to resize individual item
// *   - sortable : boolean|string - string is the css selector for handle
// *   - sortItems : function(items) - when order of items changes
// *   - connectWith : css selector of other sortables
// *   - removable : boolean - whether to display delete button on items
// *   - addItem : function(row,index,itemData) - when an item is added
// *   - removeItem : function(itemData) - called when an item is removed
// *   - filter : function(itemData) - called for each item to determine if it should be shown
// *   - sort : function(itemDataA,itemDataB) - called to sort items
// *   - scrollOnAdd : boolean - whether to scroll to newly added items
// * methods:
// *   - addItem(itemData)
// *   - removeItem(itemData)
// *   - width(width)
// *   - height(height)
// *   - items()
// *   - empty()
// *   - filter(filter)
// *   - sort(sort)
// *   - length()
test('EditableList: widget header created', () => {
  let elem = $('<div></div>')
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: "Add Button",
    height: 100,
    sortable: true,
    connectWith: 100,
    resize: () => { }
  }
  let widgetElem = elem.editableList(options);
  // log({
  //   widgetElem
  // })

  expect(widgetElem).toBeDefined()
})

/*
test('EditableList: widget without header', () => {
  let elem = $('#editable-list')
  var options = {
    class: '',
    addButton: 'Add Button',
    height: 100
  }
  let widgetElem = elem.editableList(options);
  log({
    widgetElem
  })

  expect(widgetElem).toBeDefined()
})

test('EditableList: widget addItem()', () => {
  let elem = $('#editable-list')
  // var options = {
  //   header: '<div></div>',
  //   class: '',
  //   addButton: 'Add Button',
  //   height:100
  // }
  let addItem = elem.editableList('addItem', {});
  //let addItem = elem.addItem(0, {});
  // log({
  //   widgetElem
  // })

  expect(addItem).toBeDefined();
})*/