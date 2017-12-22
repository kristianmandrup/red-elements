import {
  RED,
  readPage,
  ctx as baseCtx,
  Tips
} from '../imports'

function createTip(ctx) {
  return new Tips()
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
  tip = createTip(ctx)
})

beforeAll(() => {
  // new Searchbox(RED)
  // new EditableList(RED)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple');
})

test('Tip: create', () => {
  let tip = createTip(ctx)
  // tip.truthy(tip.enabled)
  expect(tip).toBeDefined();
})

test('Tip: setTip', () => {
  let tip = createTip(ctx);
  tip.tipBox = $("#tipBox");
  tip.setTip()
  // use nightmare to test UI
  expect(typeof tip.setTip).toBe('function');
})

test('Tip: cycleTips', () => {
  let tip = createTip(ctx)
  tip.tipBox = $("#tipBox");
  tip.cycleTips();
  expect(typeof tip.cycleTips).toBe('function');
  // use nightmare to test UI
})

// test('Tip: startTips', () => {
//   let tip = createTip(ctx)
//   tip.tipBox = $("#tipBox");
//   tip.startTips()
//   expect(typeof tip.startTips).toBe('function');

//   // use nightmare to test UI
// })

test('Tip: stopTips', () => {
  let tip = createTip(ctx)
  tip.tipBox = $("#tipBox");
  tip.stopTips()
  expect(typeof tip.stopTips).toBe('function');
  // use nightmare to test UI
})

test('Tip: nextTip', () => {
  let tip = createTip(ctx)
  tip.tipBox = $("#tipBox");
  tip.nextTip()
  expect(typeof tip.nextTip).toBe('function');
  // use nightmare to test UI
})
