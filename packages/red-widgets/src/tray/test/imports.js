import test from 'ava'
const Nightmare = require('nightmare')
const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

const {
  Tray
} = controllers

export {
  test,
  nightmare,
  Tray
}
