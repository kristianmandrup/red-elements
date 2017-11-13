import {
  controllers
} from '../imports'

const {
  Menu
} = controllers

const clazz = Menu

test('Menu: is a class', () => {
  expect(typeof clazz).toBe('function')
})
