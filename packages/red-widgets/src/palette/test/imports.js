import test from 'ava'
const Nightmare = require('nightmare')
const nightmare = new Nightmare()
import {
  controllers
} from '../controllers'

const {
  Palette,
  PaletteEditor
} = controllers

export {
  test,
  nightmare,
  Palette,
  PaletteEditor
}
