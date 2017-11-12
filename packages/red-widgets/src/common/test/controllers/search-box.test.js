import {
  controllers
} from '../imports'

const {
  Searchbox
} = controllers

const clazz = Searchbox

test('Searchbox: is a class', t => {
  expect(typeof clazz).toBe('function')
})
