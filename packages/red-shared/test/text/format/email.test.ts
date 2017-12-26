import {
  format
} from '../../..'

const {
  email
} = format

test('email: structure', () => {
  t.is(typeof email, 'object')
  t.is(typeof email.format, 'function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('email: format', () => {
  let content = 'xyz'
  t.truthy(email.format(content))
})