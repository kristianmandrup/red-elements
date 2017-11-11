import {
  test,
  nightmare,
  controllers
} from '../imports'

const {
  Searchbox
} = controllers

test('Searchbox: is a class', t => {
  t.is(typeof Searchbox, 'function')
})
