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
function createMenu(option) {
  return new Menu(option);
}
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

  let widgetElem = createMenu({
    id: 'menu',
    options: []
  })

  expect(widgetElem).toBeDefined()
})


test('Menu: can be created from id with options', () => {
  let widgetElem = createMenu({
    id: 'menu',
    options: [
      'a',
      'b'
    ]
  })
  expect(widgetElem).toBeDefined()
})
test('Menu: can be created from id with options', () => {
  let widgetElem = createMenu({})
  var menuItem = widgetElem.createMenuItem({ id: 12 });
  expect(menuItem).toBeDefined()
})

test('Menu: set selected with selected item', () => {
  let widgetElem = createMenu({});
  var result = widgetElem.setSelected("selection-active", true);
  expect(result).not.toBeDefined();
});

test('Menu: set item selected', () => {
  let widgetElem = createMenu({});
  var result = widgetElem.setSelected("selection-not-active", true);
});

test('Menu: remove item to selected', () => {
  let widgetElem = createMenu({});
  var menuItem = widgetElem.createMenuItem({ id: 12 });
  var result = widgetElem.setSelected("selection-active", false);
  expect(result).not.toBeDefined();
});

test('Menu: set element disable and enable', () => {
  let widgetElem = createMenu({ id: null });
  widgetElem.setDisabled("selection-active", true);
  let result = $("#selection-active").parent().hasClass("disabled");
  expect(result).toBe(true);
  widgetElem.setDisabled("selection-active", false);
  result = $("#selection-active").parent().hasClass("disabled");
  expect(result).toBe(false);
});

test('Menu: set element enable', () => {
  let widgetElem = createMenu({});
  widgetElem.setDisabled("selection-active", false);
  let result = $("#selection-active").parent().hasClass("disabled");
  expect(result).toBe(false);
});

test('Menu: add item with empty options', () => {
  let widgetElem = createMenu({});
  widgetElem.addItem("menu", {});
});

test('Menu: add item with options', () => {
  let widgetElem = createMenu({});
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
  let widgetElem = createMenu({});
  let id = "add-empty-item";
  let options = {
    group: "opt-group",
    label: ""
  }
  $("body").append(`<div id="add-empty-item-submenu"></div>`);
  widgetElem.addItem("add-item", options);
});

test('Menu: removeItem', () => {
  let widgetElem = createMenu({});
  widgetElem.removeItem("menu");
  expect($("#menu").length).toBe(0);
});

test('Menu: setAction', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems["menu-item"] = { "key": "value" };
  widgetElem.setAction("menu-item", function action() { });
});