import test from 'ava'
const Nightmare = require('nightmare')
const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

const {
  UserSettings
} = controllers

export {
  test,
  nightmare,
  UserSettings
}
