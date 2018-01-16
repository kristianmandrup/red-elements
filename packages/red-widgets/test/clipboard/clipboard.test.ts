import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  Clipboard
} = widgets

function create() {
  return new Clipboard()
}

let clipboard
beforeEach(() => {
  clipboard = create()
})

test('Clipboard: create', () => {
  expect(clipboard.disabled).toBeFalsy()

  // calls setupDialogs() which adds dialog to HTML body

  // body
})

test('Clipboard: setupDialogs', () => {
  clipboard.setupDialogs()
})

test('Clipboard: validateImport', () => {
  clipboard.validateImport()

})

test('Clipboard: importNodes', () => {
  clipboard.importNodes()

})

test('Clipboard: exportNodes', () => {
  clipboard.exportNodes()

})

test('Clipboard: hideDropTarget', () => {
  clipboard.hideDropTarget()

})

test('Clipboard: copyText', () => {
  let value = 'x'
  let element = $('#x')
  let msg = 'hello'

  clipboard.copyText(value, element, msg)
})
