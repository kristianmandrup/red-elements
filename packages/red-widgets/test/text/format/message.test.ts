import {
  format
} from '../../..'

const {
  message
} = format

test('message: structure', () => {
  expect(typeof message).toBe('object')
  expect(typeof message.format).toBe('function')
})

// format(text)
test('message: format', () => {
  let content = 'xyz'
  expect(message.format(content)).toBeTruthy()
})
