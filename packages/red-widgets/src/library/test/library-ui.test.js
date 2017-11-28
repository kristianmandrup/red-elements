import {
  RED,
  readPage,
  ctx,
  LibraryUI
} from './imports'

function create(ctx) {
  document.body.innerHTML = document.body.innerHTML =readPage('library',__dirname);;
  return new LibraryUI(ctx)
}

let ui
beforeEach(() => {
  ui = create(ctx);
})

test('LibraryUI: create', () => {
  expect(typeof ui).toBe('object')
})

// test('LibraryUI: buildFileListItem', () => {
//   let item = {
//   }
//   let li = ui.buildFileListItem(item)
//   // use jest to test returned li element
// })

// test('LibraryUI: buildFileList', () => {
//   let root = {} // document element?
//   let data = {

//   }
//   let ul = ui.buildFileList(root, data)
//   // use jest to test returned ul element
// })

test('LibraryUI: saveToLibrary', () => {
  let root = {} // document element?
  let overwrite = true;
  ui.saveToLibrary(overwrite, { ctx: RED, types: {}, editor: { getValue: function () { } }, fields: ['name', 'asdf', 'eert'] })
})
test('LibraryUI: buildFileList', () => {
  var ul = ui.buildFileList('testRoot', ['test1', 'test2', 'test3', 1, 2]);
  expect(typeof ul).toBe('object')
})
