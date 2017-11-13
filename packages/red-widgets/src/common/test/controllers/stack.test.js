import {
  controllers
} from '../imports'

const {
  Stack
} = controllers

const clazz = Stack

test('Stack: is a class', () => {
  expect(typeof clazz).toBe('function')
})
