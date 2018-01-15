import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  TypeSearch,
} = widgets

import { read } from 'fs';

// const clazz = EditableList

const options = {
  header: $('<div></div>'),
  class: 'editable',
  addButton: true,
  height: 100,
  sortable: "sortable",
  connectWith: 100,
  resize: () => { },
  sort: function (data, item) { return -1; },
  removable: true,
  addItem: function (row, index, data) { },
  scrollOnAdd: true,
  removeItem: function (data) { }
}

// TODO FIX: needs to be added to (fake) injected RED
const _ctx = {
  keyboard: {
    add() { },
    remove(txt) { }
  },
  events:
    {
      emit(id) { },

    },
  view:
    {
      focus() { }
    },
  nodes: {
    registry: { getNodeTypes() { return ['a', 'b', 'c'] } },
    getType(i) {
      if (i === 'a') {
        return { category: 'config' }
      }
      else if (i === 'b') {
        return { category: 'test1' }
      }
      else if (i === 'c') {
        return { category: 'test2' }
      }
      else if (i === 'inject') {
        return { category: 'test4' }
      }
      else if (i === 'change') {
        return { category: 'test4' }
      }
      else if (i === 'debug') {
        return { category: 'test4' }
      }
      else if (i === 'switch') {
        return { category: 'test4' }
      }
      else if (i === '') {
        return { category: 'test4' }
      }
    }
  }
}

function create(ctx) {
  return new TypeSearch()
}

let ts
beforeEach(() => {
  ts = new TypeSearch()
})

beforeAll(() => {
  document.documentElement.innerHTML = readPage('search');
})
function getSerachResult() {
  return $("#searchResults");
}
test('TypeSearch: create', () => {
  expect(ts.disabled).toBeFalsy()
})

test('TypeSearch: search', () => {
  let val = 'x';
  ts.searchResults = getSerachResult();
  ts.searchResults.editableList(options)
  ts.search(val)
  expect(typeof ts.search).toBe('function');
})

test('TypeSearch: ensureSelectedIsVisible', () => {
  ts.searchResults = $('#searchResult1');
  ts.ensureSelectedIsVisible();
  expect(typeof ts.ensureSelectedIsVisible).toBe('function');

})
test('TypeSearch: ensureSelectedIsVisible', () => {
  ts.searchResults = $('#searchResult2');
  ts.ensureSelectedIsVisible()
  expect(typeof ts.ensureSelectedIsVisible).toBe('function');
})
test('TypeSearch: ensureSelectedIsVisible', () => {
  ts.searchResults = $('#searchResult3');
  ts.ensureSelectedIsVisible();
  expect(typeof ts.ensureSelectedIsVisible).toBe('function');
})

test('TypeSearch: createDialog', () => {
  ts.searchResults = $('#searchResult1');
  ts.createDialog();
  expect(typeof ts.createDialog).toBe('function');
})

test('TypeSearch: createDialog', () => {
  var input = $(':input');
  ts.searchResults = $('#searchResult4');
  var e: any = $.Event('keydown');
  e.keyCode = 40; // 'down arrow'
  input.trigger(e);
  expect(typeof ts.createDialog).toBe('function');
  // ts.searchResults.editableList.filter("");
})

test('TypeSearch: confirm', () => {
  let def = { type: "" }
  ts.hide;
  ts.addCallback = function (val) { };
  ts.confirm(def)
  expect(typeof ts.confirm).toBe('function');
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
  expect(typeof ts.handleMouseActivity).toBe('function');
})
test('TypeSearch: handleMouseActivity', () => {
  ts = create(_ctx)
  let def = {}
  ts.visible = true;
  var evt = $.Event('click');
  var input = $('#searchResult4');
  input.trigger(evt);
  ts.handleMouseActivity(evt);
  expect(typeof ts.handleMouseActivity).toBe('function');
})

test('TypeSearch: handleMouseActivity', () => {
  ts = create(_ctx)
  let def = {}
  ts.visible = true;
  ts.dialog = {
    hide() { }
  }
  var evt = $.Event('click');
  var input = $('#searchResult4');
  input.trigger(evt);
  ts.searchResultsDiv = $("<div></div>");
  ts.searchInput = $("<input/>");
  ts.handleMouseActivity(evt);
  expect(typeof ts.handleMouseActivity).toBe('function');
})

test('TypeSearch: handleMouseActivity', () => {
  let def = {}
  ts.visible = true;
  var evt = $.Event('click');
  var input = $(':input');
  input.trigger(evt);
  ts.handleMouseActivity(evt);
  expect(typeof ts.handleMouseActivity).toBe('function');
})
test('TypeSearch: show', () => {
  ts = create(_ctx)
  let opts = {};
  ts.dialog = $("#dialog");
  ts.searchResultsDiv = $("#searchResultDiv");
  ts.searchResults = getSerachResult();
  ts.searchInput =
    {
      searchBox(val, txt) { }
    };
  console.log(ts.dialog)
  ts.show(opts)
  // use nightmare
})
test('TypeSearch: show', () => {
  ts = create(_ctx)
  let opts = {};
  ts.dialog = $("#dialog");;
  ts.searchResultsDiv = $("#searchResultDiv");
  ts.searchResults = getSerachResult();
  ts.searchInput =
    {
      searchBox(val, txt) { }
    };
  ts.show(opts)
  // use nightmare
})
test('TypeSearch: show', () => {
  var _ctx = Object.assign({
    keyboard: {
      add() { },
      remove(txt) { }
    },
    events:
      {
        emit(id) { },

      },
    view:
      {
        focus() { }
      },
    nodes: {
      registry: { getNodeTypes() { return ['a', 'b', 'c'] } },
      getType(i) {
        if (i === 'a') {
          return { category: 'config' }
        }
        else if (i === 'b') {
          return { category: 'test1' }
        }
        else if (i === 'c') {
          return { category: 'test2' }
        }
        else if (i === 'inject') {
          return { category: 'test4' }
        }
      }
    }
  }, ctx)
  ts = create(_ctx)
  let opts = {};
  ts.dialog = $("#dialog");
  ts.searchResultsDiv = $("#searchResultDiv");
  ts.searchResults = getSerachResult();
  ts.visible = true;
  ts.searchInput =
    {
      searchBox(val, txt) { }
    };
  ts.show(opts)
})
// test('TypeSearch: hide', () => {
//   let opts = {}
//   let fast = 'x'
//   ts.hide(fast)
//   // use nightmare
// })

test('TypeSearch: getTypeLabel', () => {
  let opts = {}
  let type = 'x'
  let def = { paletteLabel: "" }
  ts.getTypeLabel(type, def)
  // use nightmare
})

test('TypeSearch: with paletteLabel undefine', () => {
  let opts = {}
  let type = 'x'
  let def = { paletteLabel: "asdsadasldk" }
  ts.getTypeLabel(type, def)
  // use nightmare
})
// test('TypeSearch: refreshTypeList', () => {
//   ts.refreshTypeList()
//   // use nightmare
// })
