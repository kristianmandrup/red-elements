import {
  test,
  nightmare,
  controllers
} from '../imports'

const {
  Panel
} = controllers

test('Panel: is a class', t => {
  t.is(typeof Panel, 'function')
})
