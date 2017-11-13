import {

  controllers
} from '../imports'

const {
  TypedInput
} = controllers

const clazz = TypedInput

test('TypedInput: is a class', () => {
  expect(typeof clazz).toBe('function')
})
