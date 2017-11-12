import {
  controllers
} from '../imports'

const {
  Stack
} = controllers

const clazz = Stack

test('Stack: is a class', t => {
  expect(typeof clazz).toBe('function')
})
