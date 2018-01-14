import {
  format
} from '../../..'

const {
  misc
} = format

test('misc: structure', () => {
  expect(typeof misc).toBe('object')
  expect(typeof misc.isBidiLocale).toBe('function')
})

// isBidiLocale(locale)
test('misc: isBidiLocale', () => {
  let locale = 'us'
  expect(misc.isBidiLocale(locale)).toBeTruthy()
})
