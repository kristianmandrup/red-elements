import test from 'ava'
const Nightmare = require('nightmare')
const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

const {
  Search,
  TypeSearch
} = controllers

export {
  test,
  nightmare,
  Search,
  TypeSearch
}
