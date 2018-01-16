import {
  I18n
} from '../'

import {
  expectObj
} from './_infra'

function create() {
  return new I18n()
}

let inst
beforeEach(() => {
  inst = create()
})

async function testBadCatalog(name?: string) {
  await inst.init()
  try {
    const loaded = await inst.loadCatalog(name)
    log('unexpected', {
      loaded
    })
  } catch (err) {
    expect(err).toBeDefined()
  }
}


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

const { log } = console
test('I18n: create', () => {
  expectObj(inst)
  expectObj(inst.i18n)
})

test('i18n: init', async () => {
  await inst.init()
  expectObj(inst.i18n)
})

// TODO: mock Ajax responses via nock
test('i18n: loadCatalog - no namespace fails', async () => {
  testBadCatalog()
})

test.only('i18n: loadCatalog - unknown namespace fails', async () => {
  testBadCatalog('unknown')
})

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
