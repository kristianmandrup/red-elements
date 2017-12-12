var matchers = require('jest-jquery-matchers');
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

import {
  common
} from '../../'

export {
  RED,
  readPage,
  ctx
}
  from '../../test/setup'

export {
  // nightmare,
  Tray
}