import {
  format
} from '../../..'

const {
  email
} = format

test('email: structure', () => {
  expect(typeof email).toBe('object')
  expect(typeof email.format).toBe('function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('email: format', () => {
  let content = 'xyz'
  expect(email.format(content)).toBeTruthy()
})
