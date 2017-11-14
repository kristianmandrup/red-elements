import {
  View,
  RED,
  readPage,
  ctx
} from './imports'

function create(ctx) {
  return new View(ctx)
}

let view
beforeEach(() => {
  view = create(ctx)
})

beforeAll(() => {
  document.documentElement.innerHTML = readPage('simple')
})

test('View: create', () => {
  let diff = create(ctx)
  t.deepEqual(diff.currentDiff, {})
  t.falsy(diff.diffVisible)
})
