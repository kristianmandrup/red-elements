import {
  readPage,
  widgets
} from '../imports';

const {
  Tabs
} = widgets

const clazz = Tabs

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
  widgetElem = new Tabs({
    id: 'tabs'
  })
})
test('Tabs: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Tabs: widget can NOT be created without id: or element: option', () => {
  try {
    let badElem = new Tabs({})
    expect(badElem).not.toBeDefined()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('Tabs: widget can NOT be created without option type object', () => {
  try {
    let badElem = new Tabs("options");
    expect(badElem).not.toBeDefined()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('Tabs: widget can be created with element: option', () => {
  let el = document.createElement('div')
  let element = $(el)
  let tabs = new Tabs({
    element
  })
  expect(tabs).toBeDefined()
})

test('Tabs: widget can set RED as 2nd option', () => {
  let el = document.createElement('div')
  let element = $(el)
  let tabs = new Tabs({
    element
  })
  expect(tabs.RED).toBeDefined()
})


test('Tabs: widget can be created from target elem', () => {
  expect(widgetElem).toBeDefined()
})

test('Tabs: widget can be created from different options', () => {
  let options = {
    id: "tabs",
    vertical: true,
    addButton: function () { },
    scrollable: true,
    onclick: function () { }
  };
  let RED = {
    text: {
      bidi: {

      }
    }
  }
  let tabs = new Tabs(options);
  $(".red-ui-tab-button").find('a').trigger('click');
  $(".red-ui-tab-scroll-left").trigger('click');
  $(".red-ui-tab-scroll-left").trigger('mousedown');
  $(".red-ui-tab-scroll-right").trigger('click');
  $(".red-ui-tab-scroll-right").trigger('mousedown');
})

test('Tabs: handle add tab click event without options', () => {
  let result = widgetElem.handleAddButtonClickedEvent(mockEvent(), {});
  expect(result).toBe(false);
});

test('Tabs: handle add tab click event without options add button', () => {
  let result = widgetElem.handleAddButtonClickedEvent(mockEvent(), { addButton: function () { } });
  expect(result).toBe(undefined);
});

function mockEvent(opts?) {
  return {
    preventDefault: () => { }
  }
}

test('Tabs: scrollEventHandler', () => {
  let event = mockEvent()
  let direction = 'left'
  let scrolled = widgetElem.scrollEventHandler(event, direction)
  expect(scrolled).toBe(widgetElem)
})

test('Tabs: onTabClick', () => {
  let clicked = widgetElem.onTabClick()
  expect(clicked).toBe(false)
})

test('Tabs: updateScroll', () => {
  let ele = new Tabs({
    id: "tabs",
    scrollable: true
  })
  let updated = ele.updateScroll()
  expect(updated).toBe(ele)
})

const blankDivOptions = {
  id: "empty-tabs",
  vertical: true,
  addButton: function () { },
  scrollable: true,
  onclick: function () { }
};
const _RED = {
  text: {
    bidi: {

    }
  }
};

test('Tabs: updateScroll with blank div', () => {
  let options = blankDivOptions;
  let RED = _RED;
  let ele = new Tabs(options);
  let updated = ele.updateScroll();
  expect(updated).toBe(ele);
  expect(ele.scrollLeft.is(":visible")).toBe(false);
})

test('Tabs: updateScroll with scroll left', () => {
  let ele = new Tabs({
    id: "tabs",
    scrollable: true
  });
  ele.scrollContainer.scrollLeft(15);
  let updated = ele.updateScroll();
  expect(updated).toBe(ele);
  expect(ele.scrollLeft.is(":visible")).toBe(false);
  ele.scrollContainer.scrollLeft(0);
})


test('Tabs: onTabDblClick', () => {
  let updated = widgetElem.onTabDblClick()
  expect(updated).toBe(false)
})

test('Tabs: activateTab', () => {
  let link = 'x'
  let ele = new Tabs({
    id: "tabs",
    scrollable: true
  });
  let activated = ele.activateTab(link)
  expect(activated).toBe(ele)
})


test('Tabs: activateTab', () => {
  let li = $("<li class=''><a></a></li>");
  let ele = new Tabs({
    id: "tabs",
    scrollable: true
  });
  let activated = ele.activateTab(li.find("a"));
  expect(activated).toBe(ele)
})

test('Tabs: activatePreviousTab', () => {
  let activated = widgetElem.activatePreviousTab()
  expect(activated).toBe(widgetElem)
})

test('Tabs: activateNextTab', () => {
  let activated = widgetElem.activateNextTab()
  expect(activated).toBe(widgetElem)
})

test('Tabs: updateTabWidths', () => {
  let updated = widgetElem.updateTabWidths()
  expect(updated).toBe(widgetElem)
})

test('Tabs: removeTab', () => {
  let id = 'first'
  let updated = widgetElem.removeTab(id)
  expect(updated).toBeDefined()
})

test('Tabs: addTab(tab) - returns added and increases tab count', () => {
  let tab = {
    id: 'xtraTab'
  }
  let beforeCount = widgetElem.count()
  expect(beforeCount).toBe(0)

  let added = widgetElem.addTab(tab)
  expect(added).toBe(widgetElem)

  let newCount = widgetElem.count()
  expect(newCount).toBeGreaterThan(beforeCount)
  expect(newCount).toBe(1)
})

test('Tabs: addTab(tab) - add duplicate ignored', () => {
  let tab1 = {
    id: 'xtraTab'
  }
  let tab2 = {
    id: 'xtraTab'
  }

  let beforeCount = widgetElem.count()
  expect(beforeCount).toBe(0)

  widgetElem.addTab(tab1)
  widgetElem.addTab(tab2)

  let newCount = widgetElem.count()
  expect(newCount).toBeGreaterThan(beforeCount)
  expect(newCount).toBe(1)
})


test('Tabs: addTabs(tabs) - returns added and increases tab count', () => {
  let tab1 = {
    id: 'tab1'
  }
  let tab2 = {
    id: 'tab2'
  }

  let beforeCount = widgetElem.count()
  expect(beforeCount).toBe(0)

  let added = widgetElem.addTabs(tab1, tab2)
  expect(added).toBe(widgetElem)

  let newCount = widgetElem.count()
  expect(newCount).toBeGreaterThan(beforeCount)
  expect(newCount).toBe(2)
})

test('Tabs: count', () => {
  widgetElem = new Tabs({
    id: 'empty-tabs'
  })

  let id = 'xtraTab'
  let tab = {
    id
  }
  let beforeCount = widgetElem.count()
  expect(beforeCount).toBe(0)

  let added = widgetElem.addTab(tab)
  expect(added).toBe(widgetElem)

  let addCount = widgetElem.count()

  expect(addCount).toBeGreaterThan(beforeCount)
  expect(addCount).toBe(1)

  let removed = widgetElem.removeTab(id)
  let removeCount = widgetElem.count()
  expect(removeCount).toBeLessThan(addCount)
  expect(removeCount).toBe(0)
})

test('Tabs: contains - no such tab: false', () => {
  let id = 'first'
  let contained = widgetElem.contains(id)
  expect(contained).toBe(false)
})

test('Tabs: contains - has tab with id: true', () => {
  let id = 'first'
  const tab = new Tabs({
    element: $("<div><a href='#first'></a></div>")
  })
  let contained = tab.contains(id)
  expect(contained).toBeTruthy()
})

test('Tabs: renameTab(id, label) - no such tab', () => {
  let id = 'first'
  let label = 'hello'
  let renamed = widgetElem.renameTab(id, label)
  expect(renamed).toBe(widgetElem)
  // is this correct?
  let renamedTab = renamed.tabs[id]
  expect(renamedTab).not.toBeDefined()
})

// TODO: Add actual tabs for one to be removed
test('Tabs: renameTab(id, label) - has such a tab', () => {
  const tab1 = {
    id: 'tab1'
  }
  const tab2 = {
    id: 'tab2'
  }
  let label = 'hello';

  widgetElem
    .addTab(tab1)
    .addTab(tab2)

  let renamed = widgetElem.renameTab(tab1.id, label)
  let renamedTab = renamed.tabs[tab1.id]
  expect(renamedTab.label).toBe(label)
})

test('Tabs: ids', () => {
  let id1 = 'tab1', id2 = 'tab2'
  let tab1 = {
    id: id1
  }
  let tab2 = {
    id: id2
  }

  widgetElem
    .addTab(tab1)
    .addTab(tab2)

  expect(widgetElem.ids).toContain(id1)
  expect(widgetElem.ids).toContain(id2)
})


test('Tabs: existingTabOrder', () => {
  let id1 = 'tab1', id2 = 'tab2'
  let tab1 = {
    id: id1
  }
  let tab2 = {
    id: id2
  }

  widgetElem
    .addTab(tab1)
    .addTab(tab2)

  let { tabOrder } = widgetElem
  expect(tabOrder[0]).toBe(id1)
  expect(tabOrder[1]).toBe(id2)
})


test('Tabs: order', () => {
  // TODO: set to real tabs in Tabs
  let id1 = 'tab1', id2 = 'tab2'
  let tab1 = {
    id: id1
  }
  let tab2 = {
    id: id2
  }

  widgetElem
    .addTab(tab1)
    .addTab(tab2)

  let { tabOrder } = widgetElem

  expect(tabOrder[0]).toBe(id1)
  expect(tabOrder[1]).toBe(id2)

  // reverse order
  let order = [id2, id1]
  let ordered = widgetElem.order(order)

  let newTabOrder = widgetElem.tabOrder
  expect(newTabOrder[0]).toBe(id2)
  expect(newTabOrder[1]).toBe(id1)
})


