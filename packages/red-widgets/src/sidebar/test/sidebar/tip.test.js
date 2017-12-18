import {
  RED,
  readPage,
  ctx as baseCtx,
  Tip
} from '../imports'

const ctx = {}

function createTip(ctx) {
  return new Tip(ctx)
}

const ctx = Object.assign({
  // menu,
  // sidebar
  // events,
  // actions,
  // view,
  // tray
}, baseCtx)

let tip
beforeEach(() => {
  tip = create(ctx)
})

beforeAll(() => {
  // Searchbox(RED)
  // EditableList(RED)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple');
})

test('Tip: create', () => {
  let tip = createTip(ctx)
  t.truthy(tip.enabled)
})

test('Tip: setTip', () => {
  let tip = createTip(ctx)
  tip.setTip()
  // use nightmare to test UI
})

test('Tip: cycleTips', () => {
  let tip = createTip(ctx)
  tip.cycleTips()
  // use nightmare to test UI
})

test('Tip: startTips', () => {
  let tip = createTip(ctx)
  tip.startTips()
  // use nightmare to test UI
})

test('Tip: stopTips', () => {
  let tip = createTip(ctx)
  tip.stopTips()
  // use nightmare to test UI
})

test('Tip: nextTip', () => {
  let tip = createTip(ctx)
  tip.nextTip()
  // use nightmare to test UI
})
