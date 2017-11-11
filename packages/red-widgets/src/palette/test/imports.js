// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import * as matchers from 'jest-jquery-matchers'
import {
  controllers
} from '../controllers'

beforeAll(done => {
  jest.addMatchers(matchers);
});

const {
  Palette,
  PaletteEditor
} = controllers

export {
  // nightmare,
  Palette,
  PaletteEditor
}
