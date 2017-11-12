import {
  controllers
} from '../imports'

const {
  Popover
} = controllers

const clazz = Popover

test('Popover: is a class', t => {
  expect(typeof clazz).toBe('function')
})
