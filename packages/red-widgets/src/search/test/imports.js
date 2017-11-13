// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import * as matchers from 'jest-jquery-matchers'
import {
  controllers
} from '../controllers'

import {
  common
} from '../../'

const {
  Searchbox,
  EditableList
} = common.controllers

beforeAll(() => {
  jest.addMatchers(matchers);
});

const {
  Search,
  TypeSearch
} = controllers

export {
  // nightmare,
  Search,
  TypeSearch,
  Searchbox,
  EditableList
}
