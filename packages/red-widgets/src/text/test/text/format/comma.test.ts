import {
  format
} from '../../..'

const {
  comma
} = format

test('comma: structure', () => {
  expect(typeof comma).toBe('object')
  expect(typeof comma.format).toBe('function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('comma: format', () => {
  let text = 'my text'
  expect(comma.format(text)).toBeTruthy()
})
