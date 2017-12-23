// import {
//   default as i18n
// } from 'i18next'
var matchers = require('jest-jquery-matchers');

beforeAll(() => {
  jest.addMatchers(matchers);
});

const path = require('path');
const {
  log
} = console

// const translate = i18n.t
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
  const filePath = path.resolve(basePath || __dirname, 'app', `${name}.html`)
  log('readPage', {
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


export {
  RED,
  ctx,
  readPage
}
