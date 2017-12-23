import {
  RED,
  readPage,
  Tips
} from '../imports'

function createTip() {
  return new Tips()
}

let tip
beforeEach(() => {
  tip = createTip()
})

beforeAll(() => {
  // new Searchbox(RED)
  // new EditableList(RED)
  document.documentElement.innerHTML = readPage('simple')
})

test('Tip: create', () => {
  expect(tip).toBeDefined();
})

test('Tip: setTip', () => {
  tip.tipBox = $("#tipBox");
  tip.setTip()
})

test('Tip: cycleTips', () => {
  tip.tipBox = $("#tipBox");
  tip.cycleTips();
})

test('Tip: startTips', () => {
  tip.tipBox = $("#tipBox");
  tip.startTips()
})

test('Tip: stopTips', () => {
  tip.tipBox = $("#tipBox");
  tip.stopTips()
})

test('Tip: nextTip', () => {
  tip.tipBox = $("#tipBox");
  tip.nextTip()
})
