// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import * as matchers from 'jest-jquery-matchers'
import {
  controllers
} from '../controllers'

beforeAll(() => {
  jest.addMatchers(matchers);
});

const {
  Library,
  LibraryUI
} = controllers

export {
  // nightmare,
  Library,
  LibraryUI
}
