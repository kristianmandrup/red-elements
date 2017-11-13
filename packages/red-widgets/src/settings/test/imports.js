import * as matchers from 'jest-jquery-matchers'
// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

beforeAll(() => {
  jest.addMatchers(matchers);
});

const {
  UserSettings
} = controllers

export {
  // nightmare,
  UserSettings
}
