import {
  controllers
} from '../imports'

const {
  CheckboxSet
} = controllers

const clazz = CheckboxSet

test('CheckboxSet: is a class', t => {
  expect(typeof clazz).toBe('function')
})
