import {
  format
} from '../../..'

const {
  formula
} = format

test('formula: structure', () => {
  expect(typeof formula).toBe('object')
  expect(typeof formula.format).toBe('function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('formula: format', () => {
  let content = 'xyz'
  expect(formula.format(content)).toBeTruthy()
})
