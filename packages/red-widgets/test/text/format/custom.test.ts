import {
  format
} from '../../..'

const {
  custom
} = format

test('custom: structure', () => {
  expect(typeof custom).toBe('object')
  expect(typeof custom.format).toBe('function')
})

//
test('custom: format', () => {
  let content = 'xyz'
  expect(custom.format(content)).toBeTruthy()
})
