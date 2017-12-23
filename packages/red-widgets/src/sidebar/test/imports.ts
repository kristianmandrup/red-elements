// const Nightmare = require('nightmare')
// const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

export {
  RED,
  readPage
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
  SidebarTabConfig,
  SidebarTabInfo,
  Tips
} = controllers

export {
  // nightmare,
  Menu,
  Sidebar,
  SidebarTabConfig,
  SidebarTabInfo,
  Tips
}
