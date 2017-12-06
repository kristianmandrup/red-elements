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
// beforeEach(() => {
//   view = create(ctx)
// })

beforeAll(() => {
  document.documentElement.innerHTML = readPage('simple')
})

test('View: create', () => {
  ctx.touch = {
    radialMenu: {
      active: () => { }
    }
  };
  ctx.state = {
    QUICK_JOINING: true,
    JOINING: true,
    DEFAULT: true,
    MOVING_ACTIVE: true,
    MOVING: true,
    IMPORT_DRAGGING: true
  }
  ctx.history = [];
  let diff = create(ctx)
  console.log(diff)
  t.deepEqual(diff.currentDiff, {})
  t.falsy(diff.diffVisible)
})
