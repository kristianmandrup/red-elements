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
  common
} from '../../'

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
