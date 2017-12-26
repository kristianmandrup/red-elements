import {
  format
} from '../../..'

const {
  formula
} = format

test('formula: structure', () => {
  t.is(typeof formula, 'object')
  t.is(typeof formula.format, 'function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('formula: format', () => {
  let content = 'xyz'
  t.truthy(formula.format(content))
})
