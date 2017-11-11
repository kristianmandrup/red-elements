import {
  test,
  nightmare,
  controllers
} from '../imports'

const {
  Stack
} = controllers

test('Stack: is a class', t => {
  t.is(typeof Stack, 'function')
})
