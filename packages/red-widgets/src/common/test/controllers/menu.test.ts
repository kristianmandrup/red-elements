// import { bottle } from "../../../setup/setup"
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
  // var factory = bottle.container.Menu;
  // return factory.init(option);
  return new Menu(option);
}

function getLink() {
  return $("<a href='javascript:void(0)'></a>")
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


test('Menu: can create widget with options', () => {
  let options = {
    options: [null]
  }
  let widgetElem = createMenu(options);
  expect(widgetElem).toBeDefined()
});

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
  expect(typeof widgetElem.createMenuItem).toBe('function');

  expect(menuItem).toBeDefined()
})

test('Menu: set item selected with selected item without options', () => {
  let widgetElem = createMenu({});
  var result = widgetElem.setSelected("selection-active", true);
  expect(result).not.toBeDefined();
});

test('Menu: set item selected', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = {};
  widgetElem.menuItems["selection-not-active"] = { setting: {} };
  var result = widgetElem.setSelected("selection-not-active", true);
});

test('Menu: remove item to selected', () => {
  let widgetElem = createMenu({});
  var menuItem = widgetElem.createMenuItem({ id: 12 });
  widgetElem.menuItems["selection-active"] = { setting: {} };
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
  expect(typeof (widgetElem.addItem)).toBe('function');
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

test('Menu: setAction without options', () => {
  let widgetElem = createMenu({});
  widgetElem.setAction("menu-item", function action() { });
});

test('Menu: create menu items with option id', () => {
  let widgetElem = createMenu({});
  let options = {
    id: "menu-id"
  }
  widgetElem.RED.settings.theme = function (id) {
    return false;
  }
  let result = widgetElem.createMenuItem(options);
  expect(result).toBeNull();
});

test('Menu: create menu items with options', () => {
  let widgetElem = createMenu({});
  let options = {
    toggle: function () { },
    icon: "icon.png",
    sublabel: true,
    disabled: true
  }
  let item = widgetElem.createMenuItem(options);
  expect(item).not.toBeUndefined();
});

test('Menu: create menu items with options icon to jpg', () => {
  let widgetElem = createMenu({});
  let options = {
    toggle: function () { },
    icon: "icon.jpg"
  }
  let item = widgetElem.createMenuItem(options);
  expect(item).not.toBeUndefined();
});

test('Menu: create menu items with options icon to null', () => {
  let widgetElem = createMenu({});
  let options = {
    id: "link",
    toggle: function () { },
    icon: ""
  }
  let item = widgetElem.createMenuItem(options);
  expect(item).not.toBeUndefined();
});

test('Menu: create menu items with options onselect', () => {
  let widgetElem = createMenu({});
  let options = {
    onselect: function () { },
    toggle: true
  }
  let item = widgetElem.createMenuItem(options);
  item.find("a").click();
  expect(item).not.toBeUndefined();
});

test('Menu: create menu items with options href', () => {
  let widgetElem = createMenu({});
  let options = {
    href: "javascript:void(0)"
  }
  let item = widgetElem.createMenuItem(options);
  expect(item).not.toBeUndefined();
});

test('Menu: create menu items with option options', () => {
  let widgetElem = createMenu({});
  let options = {
    options: [$("<li></li>"), $("<li></li>")]
  }
  let item = widgetElem.createMenuItem(options);
  expect(item).not.toBeUndefined();
});


test('Menu: trigger action with type string', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = {
    id: {
      onselect: "onselect"
    }
  };
  let mockFunction = jest.fn();
  widgetElem.RED.actions.get = function (callback) {
    return mockFunction;
  }
  widgetElem.triggerAction("id", {});
  expect(mockFunction).toHaveBeenCalled();
});

test('Menu: trigger action with type function', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = {
    id: {
      onselect: function () { }
    }
  };
  widgetElem.triggerAction("id", {});
});

test('Menu: trigger action without callback', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = {
    id: {
      onselect: undefined
    }
  };
  widgetElem.triggerAction("id", {});
});

test('Menu: set initial state without optoins', () => {
  let widgetElem = createMenu({});
  widgetElem.setInitialState({}, "")
});

function getMenuItemsOptions(element?) {
  return {
    id: {
      onselect: function () { }
    }
  }
}

function getOptionsForSetInitialState() {
  return {
    setting: true,
    id: "id",
    selected: true
  }
}

test('Menu: set initial state with optoins and RED setting true', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = getMenuItemsOptions();
  widgetElem.RED.settings.get = function (id) {
    return true;
  }
  let link = getLink();
  widgetElem.setInitialState(getOptionsForSetInitialState(), link);
  expect(typeof widgetElem.setInitialState).toBe('function');
  expect(link.hasClass("active")).toBeTruthy();
  link.removeClass("active");
});

test('Menu: set initial state with optoins RED setting true', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = getMenuItemsOptions();
  widgetElem.RED.settings.get = function (id) {
    return null;
  }
  let link = getLink();
  widgetElem.setInitialState(getOptionsForSetInitialState(), link);
  expect(link.hasClass("active")).toBeTruthy();
});

test('Menu: set initial state with optoins RED setting false', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = getMenuItemsOptions();
  widgetElem.RED.settings.get = function (id) {
    return false;
  }
  let link = getLink();
  link.addClass("active");
  expect(link.hasClass("active")).toBeTruthy();
  widgetElem.setInitialState(getOptionsForSetInitialState(), link);
  expect(link.hasClass("active")).not.toBeTruthy();
});


test('Menu: set initial state with optoins selected true', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = getMenuItemsOptions();
  widgetElem.RED.settings.get = function (id) {
    return undefined;
  }
  let link = getLink();
  expect(link.hasClass("active")).not.toBeTruthy();
  widgetElem.setInitialState(getOptionsForSetInitialState(), link);
  expect(link.hasClass("active")).toBeTruthy();
});

test('Menu: set initial state with optoins selected false', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems = getMenuItemsOptions();
  widgetElem.RED.settings.get = function (id) {
    return undefined;
  }
  let link = getLink();
  let options = getOptionsForSetInitialState();
  options.selected = false;
  link.addClass("active");
  expect(link.hasClass("active")).toBeTruthy();
  widgetElem.setInitialState(options, link);
  expect(link.hasClass("active")).not.toBeTruthy();
});

test('Menu: toggle selection', () => {
  let widgetElem = createMenu({});
  widgetElem.menuItems["selection-active"] = { setting: {}, id: "selection-active", onselect: function () { } };
  widgetElem.toggleSelected("selection-active");
  expect(typeof widgetElem.toggleSelected).toBe('function');
  expect($(".selection-active").hasClass("active")).toBe(false);
});

