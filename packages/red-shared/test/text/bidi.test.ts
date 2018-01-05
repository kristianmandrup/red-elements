import {
  Bidi
} from '../..'

function create() {
  return new Bidi()
}

let bidi
beforeEach(() => {
  bidi = create()
})

test('Bidi: create', () => {
  expect(typeof bidi).toBe('object')
})

test('Bidi: isRTLValue() - throws', () => {
  expect(() => bidi.isRTLValue()).toThrow()
})

test(`Bidi: isRTLValue("abc") is ok`, () => {
  expect(bidi.isRTLValue('abc')).toBeTruthy()
})

test(`Bidi: isBidiChar(0x0100) throws`, () => {
  expect(() => bidi.isBidiChar(0x0100)).toThrow()
})

test(`Bidi: isBidiChar(0x0600) is ok`, () => {
  expect(bidi.isBidiChar(0x0600)).toBeTruthy()
})

test(`Bidi: isLatinChar(3) throws`, () => {
  expect(() => bidi.isLatinChar()).toThrow()
})

test(`Bidi: isLatinChar(72) is ok`, () => {
  expect(bidi.isLatinChar(72)).toBeTruthy()
})

test(`Bidi: resolveBaseTextDir() LTR`, () => {
  expect(bidi.resolveBaseTextDir('abc')).toBe('ltr')
})

test(`Bidi: resolveBaseTextDir() LTR`, () => {
  let rtl = '???'
  expect(bidi.resolveBaseTextDir(rtl)).toBe('rtl')
})

test(`Bidi: onInputChange()`, () => {
})

test(`Bidi: prepareInput(input)`, () => {
})

test(`Bidi: enforceTextDirectionWithUCC(value)`, () => {
})

test(`Bidi: enforceTextDirectionOnPage()`, () => {
})

test(`Bidi: setTextDirection(dir)`, () => {
})
