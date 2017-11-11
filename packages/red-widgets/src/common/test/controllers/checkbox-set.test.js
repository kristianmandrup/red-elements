import {
  controllers
} from '../imports'

const {
  CheckboxSet
} = controllers

test('CheckboxSet: is a class', t => {
  t.is(typeof CheckboxSet, 'function')
})
