import {
  format
} from '../../..'

const {
  breadcrumb
} = format

test('breadcrumb: structure', () => {
  expect(typeof breadcrumb).toBe('object')
  expect(typeof breadcrumb.format).toBe('function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('breadcrumb: format text', () => {
  let text = 'my text'
  expect(breadcrumb.format(text)).toBeTruthy()
})
