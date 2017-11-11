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
  Search,
  TypeSearch
} = controllers

export {
  // nightmare,
  Search,
  TypeSearch
}
