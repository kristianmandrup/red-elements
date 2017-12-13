import {
  RED,
  readPage,
  ctx,
  LibraryUI
} from './imports'

function create(ctx) {
  document.body.innerHTML = document.body.innerHTML = readPage('library', __dirname);
  return new LibraryUI(ctx)
}

let ui
beforeEach(() => {
  ui = create(ctx);
})

test('LibraryUI: create', () => {
  expect(typeof ui).toBe('object')
})

test('LibraryUI: buildFileListItem', () => {
  let item = {
  }
  let li = ui.buildFileListItem(item);
  li.onmouseover(null);
  li.onmouseout(null);
  // use jest to test returned li element
});

test('LibraryUI: buildFileList with string array data', () => {
  let root = {} // document element?
  let data = ['111', 'add']
  let ul = ui.buildFileList(root, data)
  var li = $(ul).children();
  li[0].onclick(null);
  // use jest to test returned ul element
});

test('LibraryUI: buildFileList with number array data', () => {
  let root = {} // document element?
  let data = [1, 2]
  let ul = ui.buildFileList(root, data)
  var li = $(ul).children();
  li[0].onclick(null);
  // use jest to test returned ul element
});

test('LibraryUI: saveToLibrary with overwrite true', () => {
  let root = {} // document element?
  let overwrite = true;
  RED["notify"] = function (callback, text) { }
  ui.saveToLibrary(overwrite, { ctx: RED, types: {}, editor: { getValue: function () { } }, fields: ['name', 'asdf', 'eert'] })
})

test('LibraryUI: saveToLibrary with overwrite false', () => {
  let root = {} // document element?
  let overwrite = false;
  RED["notify"] = function (callback, text) { }
  ui.saveToLibrary(overwrite, { ctx: RED, types: {}, editor: { getValue: function () { } }, fields: ['name', 'asdf', 'eert'] })
})
test('LibraryUI: saveToLibrary with empty input value', () => {
  let root = {} // document element?
  let overwrite = true;
  RED["notify"] = function (callback, text) { }
  $("#node-input-name").val('');
  $("#node-dialog-library-save-filename").val('');
  ui.saveToLibrary(overwrite, { ctx: RED, types: {}, editor: { getValue: function () { } }, fields: ['name', 'asdf', 'eert'] })
})
test('LibraryUI: buildFileList', () => {
  var ul = ui.buildFileList('testRoot', ['test1', 'test2', 'test3', 1, 2]);
  expect(typeof ul).toBe('object')
})

test('LibraryUI: can open menu on click', () => {
  var option = {
    ctx: ctx,
    type: "test"

  }
  var lib = create(option);
  $("#node-input-test-menu-open-library").click();
  //expect(typeof ul).toBe('object')
})
test('LibraryUI: save menu on click', () => {
  var option = {
    ctx: ctx,
    type: "test"

  }
  var lib = create(option);
  $('#node-input-test-menu-save-library').click();
  $("#node-input-name").val('');
  $('#node-input-test-menu-save-library').click();
  //expect(typeof ul).toBe('object')
})
test('LibraryUI: can open library-lookup dialog', () => {
  (<any>$("#node-dialog-library-lookup")).dialog('open');
})

test('LibraryUI: can resize library-lookup dialog', () => {
  let libLookup = $("#node-dialog-library-lookup").data('ui-dialog');
  libLookup.options.resize(null);
  expect(typeof libLookup.options.resize).toBe('function')
})
test('LibraryUI: can click library-lookup dialog button', () => {
  let libLookup = (<any>$("#node-dialog-library-lookup")).data('ui-dialog');
  libLookup.options.buttons[0].click();
  // libLookup.options.buttons[1].click();
})
test('LibraryUI: can click library-lookup dialog button', () => {
  let libLookup = $("#node-dialog-library-lookup").data('ui-dialog');
  libLookup.options.buttons[1].click();
  // libLookup.options.buttons[1].click();
})
