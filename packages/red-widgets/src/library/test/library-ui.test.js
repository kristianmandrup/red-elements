import {
  RED,
  readPage,
  ctx,
  LibraryUI
} from './imports'

function create(ctx) {
  return new LibraryUI(ctx)
}

let ui
beforeEach(() => {
  ui = create(ctx)
})

test('LibraryUI: create', () => {
  t.is(typeof ui, 'object')
})

test('LibraryUI: buildFileListItem', () => {
  let item = {

  }
  let li = ui.buildFileListItem(item)
  // use jest to test returned li element
})

test('LibraryUI: buildFileList', () => {
  let root = {} // document element?
  let data = {

  }
  let ul = ui.buildFileList(root, data)
  // use jest to test returned ul element
})

test('LibraryUI: saveToLibrary', () => {
  let root = {} // document element?
  let overwrite = true
  ui.saveToLibrary(overwrite)

  // test nofified correctly of result from save
})
