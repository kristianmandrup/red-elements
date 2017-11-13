import * as matchers from 'jest-jquery-matchers'
beforeAll(() => {
  jest.addMatchers(matchers);
});

// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

const {
  Tray
} = controllers

export {
  // nightmare,
  Tray
}
