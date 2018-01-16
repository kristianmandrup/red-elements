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


async function testCatalog(name: string) {
  await inst.init()
  try {
    const loaded = await inst.loadCatalog(name)
    expect(loaded).toBeDefined()
  } catch (err) {
    log('unexpected', {
      err
    })
  }
}

test('i18n: loadCatalog - valid my-catalog namespace loads', async () => {
  const validName = 'my-catalog'

  // TODO: register my-catalog as valid catalog

  // use test helper method to avoid duplication
  testCatalog(validName)
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
