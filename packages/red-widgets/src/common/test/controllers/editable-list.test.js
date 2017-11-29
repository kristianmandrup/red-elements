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
  let elem = $('<div style="position:absolute;top:0;width:20%"></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable"
  }
  let widgetElem = elem.editableList(options);
  expect(widgetElem).toBeDefined();
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
  expect(widgetElem).toBeDefined()
})

test('EditableList: widget addItem with empty object', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: true,
    sort: function (data, item) { return -1; }
  }
  let addItem = elem.editableList(options);
  addItem.editableList('items');
  addItem.editableList('addItem', {});
  expect(addItem).toBeDefined();
})

jest.useFakeTimers();
test('EditableList: widget addItem without data', () => {
  let elem = $('<div></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable",
    removable: true,
    addItem: function (row, index, data) { },
    scrollOnAdd: true
  }
  let addItem = elem.editableList(options).editableList('addItem');
  expect(setTimeout.mock.calls.length).toBe(1);
  expect(addItem).toBeDefined();
});


test('EditableList: widget addItems', () => {
  let elem = $('<div></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable",
    removable: true,
    addItem: function (row, index, data) { },
    scrollOnAdd: true
  };
  let items = [];
  items.push($("<div data-id='item1' data-class='item'>"));
  items.push($("<div data-id='item2' data-class='item'>"));
  items.push($("<div data-id='item3' data-class='item'>"));
  let addItem = elem.editableList(options).editableList('addItems', items);
  expect(addItem).toBeDefined();
});


test('EditableList: widget removeItems', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable",
    removable: true,
    addItem: function (row, index, data) { },
    scrollOnAdd: true,
    removeItem: function (data) { }
  };
  let addItem = elem.editableList(options).editableList('removeItem');
  expect(addItem).toBeDefined();
});

test('EditableList: widget get Items', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  var options = {
    header: $('<div></div>'),
    class: 'editable',
    addButton: true,
    height: 100,
    sortable: "sortable",
    removable: true,
    addItem: function (row, index, data) { },
    scrollOnAdd: true,
    removeItem: function (data) { }
  };
  let addItem = elem.editableList(options).editableList('items');
  expect(addItem).toBeDefined();
});

test('EditableList: empty element', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  let addItem = elem.editableList().editableList('empty');
  expect(addItem).toBeDefined();
});


test('EditableList: get element length', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  let length = elem.editableList().editableList('length');
  expect(length).toBeGreaterThanOrEqual(0);
});

test('EditableList: set element height', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  var options = {
    resizeItem: function (element, size) { }
  };
  elem.editableList(options).editableList('height', 150);
});

test('EditableList: sort elements', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  elem.editableList().editableList('sort', function (A, B) { });
});

test('EditableList: sort elements without function', () => {
  let elem = $('<div><div class="red-ui-editableList-item-content"></div><div class="red-ui-editableList-item-content"></div></div>');
  elem.editableList().editableList('sort');
});
