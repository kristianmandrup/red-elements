import test from 'ava'
const Nightmare = require('nightmare')
const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

const {
  Sidebar,
  TabConfig,
  TabInfo,
  Tips
} = controllers

export {
  test,
  nightmare,
  Sidebar,
  TabConfig,
  TabInfo,
  Tips
}
