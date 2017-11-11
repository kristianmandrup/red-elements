import {
  controllers
} from '../imports'

const {
  Menu
} = controllers

test('Menu: is a class', t => {
  t.is(typeof Menu, 'function')
})
