import * as matchers from 'jest-jquery-matchers'
// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

beforeAll(() => {
  jest.addMatchers(matchers);
});

export {
  RED,
  readPage,
  ctx,
}
from '../../test/setup'

const {
  Workspaces
} = controllers

export {
  // nightmare,
  Workspaces
}
