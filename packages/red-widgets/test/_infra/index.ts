var matchers = require('jest-jquery-matchers');

beforeAll(() => {
  jest.addMatchers(matchers);
});

const path = require('path');
const {
  log
} = console

// const translate = i18n.t

// FIX: fake i18n translation
const translate = (label) => label

const ctx = {
  _: translate
}

let RED = ctx

jest
  .dontMock('fs')
  .dontMock('jquery')

const $ = require('jquery');
const fs = require('fs')

global.$ = $

global.jQuery = global.$
require('jquery-ui-dist/jquery-ui')

function readPage(name, basePath?) {
  basePath = basePath || __dirname
  const filePath = path.resolve(basePath, 'app', `${name}.html`)
  log('readPage', {
    basePath,
    filePath
  })
  let html = fs.readFileSync(filePath).toString();

  if (!html) {
    throw new Error(`readPage: Page (DOM) could not be loaded from file: ${filePath}`)
  } else {
    log(html)
  }

  return html
}

// FIX: add i18n jQuery Widget factory
(function ($) {
  $['widget']('nodered.i18n', {
    _create: function () {
    },
    _destroy: function () {
    }
  })
})(jQuery)

log('TEST: using mock i18n widget added to all jQuery elements')
// $('<div />').i18n()

export {
  RED,
  readPage,
  $
}

export {
  widgets
} from '../../src'

