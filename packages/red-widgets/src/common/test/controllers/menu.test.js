import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Menu
} = controllers

const clazz = Menu

const {
  log
} = console

beforeAll(() => {
  // Menu has no widget factory, just a class

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

test('Menu: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Menu: can be created from id with NO options', () => {
  let elem = $('#menu')

  // note: inside Menu constructor
  //  var menuParent = $("#" + options.id);

  let widgetElem = new Menu({
    id: 'menu',
    options: []
  })

  expect(widgetElem).toBeDefined()
})


test('Menu: can be created from id with options', () => {
  let widgetElem = new Menu({
    id: 'menu',
    options: [
      'a',
      'b'
    ]
  })
  expect(widgetElem).toBeDefined()
})
test('Menu: can be created from id with options', () => {
  let widgetElem = new Menu({})
  var menuItem = widgetElem.createMenuItem({ id: null });
  expect(menuItem).toBeDefined()
})

test('Menu: set selected with selected item', () => {
  let widgetElem = new Menu({});  
  var result = widgetElem.setSelected("selection-active", true);
  expect(result).not.toBeDefined();
});

test('Menu: set item selected', () => {
  let widgetElem = new Menu({});
  var result = widgetElem.setSelected("selection-not-active", true);
});

test('Menu: remove item to selected', () => {
  let widgetElem = new Menu({});  
  var result = widgetElem.setSelected("selection-active", false);
  expect(result).not.toBeDefined();
});

test('Menu: set element disable and enable', () => {
  let widgetElem = new Menu({});
  widgetElem.setDisabled("selection-active", true);
  let result = $("#selection-active").parent().hasClass("disabled");
  expect(result).toBe(true);
  widgetElem.setDisabled("selection-active", false);
  result = $("#selection-active").parent().hasClass("disabled");
  expect(result).toBe(false);
});

test('Menu: set element enable', () => {
  let widgetElem = new Menu({});
  widgetElem.setDisabled("selection-active", false);
  let result = $("#selection-active").parent().hasClass("disabled");
  expect(result).toBe(false);
});

test('Menu: add item with empty options', () => {
  let widgetElem = new Menu({});
  widgetElem.addItem("menu", {});
});

test('Menu: add item with options', () => {
  let widgetElem = new Menu({});
  let id = "add-item";
  let options = {
    group: "opt-group",
    label: "menu-label"
  }
  $("body").append(`<div id="add-item-submenu">
                    <div class="menu-group-opt-group">
                    <label class="menu-label">menu-label</label>
                    </div>
                    <div class="menu-group-opt-group">
                      <label class="menu-label"></label>
                  </div></div>`);
  widgetElem.addItem("add-item", options);
});

test('Menu: add item with options', () => {
  let widgetElem = new Menu({});
  let id = "add-empty-item";
  let options = {
    group: "opt-group",
    label: ""
  }
  $("body").append(`<div id="add-empty-item-submenu"></div>`);
  widgetElem.addItem("add-item", options);
});

test('Menu: removeItem', () => {
  let widgetElem = new Menu({});
  widgetElem.removeItem("menu");
  expect($("#menu").length).toBe(0);
});

test('Menu: setAction', () => {
  let widgetElem = new Menu({});
  widgetElem.menuItems["menu-item"] = { "key": "value" };
  widgetElem.setAction("menu-item", function action() { });
});