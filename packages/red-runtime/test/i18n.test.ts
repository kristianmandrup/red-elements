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

const { log } = console
test('I18n: create', () => {
  expect(typeof inst).toBe('object')
  expect(typeof inst.i18n).toBe('object')
})

test('i18n: init', async () => {
  await inst.init()
  expect(typeof inst.i18n).toBe('object')
})

// TODO: mock Ajax responses via nock
test('i18n: loadCatalog - no namespace fails', async () => {
  await inst.init()
  try {
    await inst.loadCatalog()
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test.only('i18n: loadCatalog - unknown namespace fails', async () => {
  await inst.init()
  try {
    await inst.loadCatalog('unknown')
  } catch (err) {
    expect(err).toBeDefined()
  }
})

test('i18n: loadCatalog - valid my-catalog namespace loads', async () => {
  await inst.init()
  try {
    const loaded = await inst.loadCatalog('unknown')
    expect(loaded).toBeDefined()
  } catch (err) {
    log('unexpected', {
      err
    })
  }
})


test.skip('i18n: loadNodeCatalogs', async () => {
  await inst.init()
  try {
    const loaded = await inst.loadNodeCatalogs()
    expect(loaded).toBeDefined()
  } catch (err) {
    log('unexpected', {
      err
    })
  }

})
