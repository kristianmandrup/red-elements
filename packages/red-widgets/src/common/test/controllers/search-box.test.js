import {
  controllers
} from '../imports'

const {
  Searchbox
} = controllers

const clazz = Searchbox

test('Searchbox: is a class', () => {
  expect(typeof clazz).toBe('function')
})
