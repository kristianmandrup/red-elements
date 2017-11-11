import {
  test,
  nightmare,
  controllers
} from '../imports'

const {
  TypedInput
} = controllers

test('TypedInput: is a class', t => {
  t.is(typeof TypedInput, 'function')
})
