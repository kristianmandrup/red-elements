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
  EditableList
} = widgets.common.controllers

const {
  NodeDiff
} = controllers

export {
  // nightmare,
  NodeDiff,
  EditableList
}
