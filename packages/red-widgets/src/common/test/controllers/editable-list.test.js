import {
  controllers
} from '../imports'

const {
  EditableList
} = controllers

const clazz = EditableList

test('EditableList: is a class', t => {
  expect(typeof clazz).toBe('function')
})
