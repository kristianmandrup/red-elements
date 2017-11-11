import {
  test,
  nightmare,
  controllers
} from '../imports'

const {
  EditableList
} = controllers

test('EditableList: is a class', t => {
  t.is(typeof EditableList, 'function')
})
