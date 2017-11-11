import {
  controllers
} from '../imports'

const {
  Tabs
} = controllers

test('Tabs: is a class', t => {
  t.is(typeof Tabs, 'function')
})
