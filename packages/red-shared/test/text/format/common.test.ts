import {
  format
} from '../../..'

const {
  common
} = format

test('common: structure', () => {
  expect(typeof common).toBe('object')
  expect(typeof common.handle).toBe('function')
})

// handle(content, segments, args, locale)
test('common: handle', () => {
  let content = 'xyz'
  expect(common.handle(content)).toBeTruthy()
})
