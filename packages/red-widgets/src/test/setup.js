// import {
//   default as i18n
// } from 'i18next'
import * as matchers from 'jest-jquery-matchers'

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
// log({
//   $: global.$
// })

global.jQuery = global.$
require('jquery-ui-dist/jquery-ui')

function readPage(name) {
  const filePath = path.join(__dirname, `./app/${name}.html`)

  return fs.readFileSync(filePath).toString();
}


export {
  RED,
  ctx,
  readPage
}
