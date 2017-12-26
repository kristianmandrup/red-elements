import {
  format
} from '../../..'

const {
  filepath
} = format

test('filepath: structure', () => {
  expect(typeof filepath).toBe('object')
  expect(typeof filepath.format).toBe('function')
})

// format(text, args, isRtl, isHtml, locale, parseOnly)
test('filepath: format', () => {
  let content = 'xyz'
  expect(filepath.format(content)).toBeTruthy()
})
