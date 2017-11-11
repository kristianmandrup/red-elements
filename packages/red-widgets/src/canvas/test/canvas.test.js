import {
  test,
  nightmare,
  View
} from '../imports'
const ctx = {}

function create(ctx) {
  return new View(ctx)
}

test('View: create', t => {
  let diff = create(ctx)
  t.deepEqual(diff.currentDiff, {})
  t.falsy(diff.diffVisible)
})
