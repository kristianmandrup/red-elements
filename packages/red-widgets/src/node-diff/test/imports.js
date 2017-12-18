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
from '../../test/_setup'

import {
  common
} from '../../_index'

const {
  EditableList
} = common.controllers

const {
  Diff
} = controllers

export {
  // nightmare,
  Diff,
  EditableList
}
