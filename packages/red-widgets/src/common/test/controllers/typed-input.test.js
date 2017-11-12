import {
  controllers
} from '../imports'

const {
  TypedInput
} = controllers

const clazz = TypedInput

test('TypedInput: is a class', t => {
  expect(typeof clazz).toBe('function')
})
