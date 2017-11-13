import {
  controllers
} from '../imports'

const {
  Panel
} = controllers

const clazz = Panel

describe('Panel', () => {
  test('is a class', () => {
    expect(typeof clazz).toBe('function')
  })
})
