import {
  controllers
} from '../imports'

const {
  Popover
} = controllers

const clazz = Popover

test('Popover: is a class', () => {
  expect(typeof clazz).toBe('function')
})
