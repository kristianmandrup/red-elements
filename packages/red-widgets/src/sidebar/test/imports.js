// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

export {
  RED,
  readPage,
  ctx,
}
from '../../test/setup'

import {
  common
} from '../../common'

const {
  Menu
} = common.controllers

const {
  Sidebar,
  TabConfig,
  TabInfo,
  Tips
} = controllers

export {
  // nightmare,
  Menu,
  Sidebar,
  TabConfig,
  TabInfo,
  Tips
}
