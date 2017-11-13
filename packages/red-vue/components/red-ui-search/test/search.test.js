const nightmare = require('../nightmare')
import test from 'ava'
import {
  Search
} from '../../../src/new/ui/search'
const ctx = {}

function create(ctx) {
  return new Search(ctx)
}

test('Search: create', () => {
  let search = create(ctx)
  t.falsy(search.disabled)
})

test('Search: indexNode', () => {
  let search = create(ctx)
  let n = {
    id: 'x',
    label: 'abc'
  }
  search.indexNode(n)
  // fix
  let indexed = search.index[n.label]
  t.is(indexed, n)
})

test('Search: indexWorkspace', () => {})
test('Search: search', () => {})
test('Search: ensureSelectedIsVisible', () => {})
test('Search: createDialog', () => {})
test('Search: reveal', () => {})
test('Search: show', () => {})
test('Search: hide', () => {})
