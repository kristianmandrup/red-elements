const nightmare = require('../nightmare')
import test from 'ava'
import {
  Clipboard
} from './ui'

function create() {
  return new Clipboard()
}

test('Clipboard: create', () => {
  t.falsy(clipboard.disabled)

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
