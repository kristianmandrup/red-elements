import test from 'ava'
import {
  format
} from '../text'

const {
  breadcrumb
} = format

test('breadcrumb: structure', () => {
  t.is(typeof breadcrumb, 'object')
  t.is(typeof breadcrumb.format, 'function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('breadcrumb: format text', () => {
  let text = 'my text'
  t.truthy(breadcrumb.format(text))
})
