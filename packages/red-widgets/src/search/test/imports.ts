// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()

import {
  controllers
} from '../controllers'

export {
  RED,
  readPage,
  ctx
}
  from '../../test/setup'

import {
  widgets
} from '../../index'

const {
  Searchbox,
  EditableList
} = widgets.common.controllers

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
