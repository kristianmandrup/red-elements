import {
  test,
  nightmare,
  controllers
} from '../imports'

const {
  Popover
} = controllers

test('Popover: is a class', t => {
  t.is(typeof Popover, 'function')
})
