import {
  I18n
} from '../'

function create() {
  return new I18n()
}

let inst
beforeEach(() => {
  inst = create()
})

test('I18n: create', () => {
  expect(typeof inst).toBe('object')
  expect(typeof inst.i18n).toBe('object')
})

test('i18n: init', async () => {
  await inst.init()
  expect(typeof inst.i18n).toBe('object')
})

test('i18n: loadCatalog - no namespace fails', async () => {
  await inst.init()
  expect(() => await inst.loadCatalog()).toThrowError()
})

test('i18n: loadCatalog - unknown namespace fails', async () => {
  await inst.init()
  expect(() => await inst.loadCatalog('unknown')).toThrowError()
})

test('i18n: loadCatalog - valid my-catalog namespace loads', async () => {
  await inst.init()
  expect(() => await inst.loadCatalog('my-catalog')).toThrowError()
})


test('i18n: loadCatalogs', async () => {

})
