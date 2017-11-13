import {
  controllers
} from '../imports'

const {
  Tabs
} = controllers

const clazz = Tabs

test('Tabs: is a class', () => {
  expect(typeof clazz).toBe('function')
})
