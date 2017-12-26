import {
  format
} from '../../..'

const {
  comma
} = format

test('comma: structure', () => {
  t.is(typeof comma, 'object')
  t.is(typeof comma.format, 'function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('comma: format', () => {
  let text = 'my text'
  t.truthy(comma.format(text))
})
