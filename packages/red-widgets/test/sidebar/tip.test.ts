import {
  $,
  widgets,
  readPage
} from '../_infra'

const {
  Tips
} = widgets

function create() {
  return new Tips()
}

const { log } = console

let tips
beforeEach(() => {
  tips = create()
})

beforeAll(() => {
  document.documentElement.innerHTML = readPage('tips');
})

test('Tips: create', () => {
  expect(tips).toBeDefined();
})

test('Tips: setTip', () => {
  tips.tipBox = $("#tipBox");
  const wasSet = tips.setTip()
  expect(wasSet).toBeDefined()
})

test('Tips: cycleTips', () => {
  tips.tipBox = $("#tipBox");
  const cycled = tips.cycleTips();
  expect(cycled).toBeDefined()
})

test('Tips: startTips', () => {
  tips.tipBox = $("#tipBox");
  const started = tips.startTips()
  expect(started).toBeDefined()
})

test('Tips: stopTips', () => {
  tips.tipBox = $("#tipBox");
  const stopped = tips.stopTips()
  expect(stopped).toBeDefined()
})

test('Tips: nextTip', () => {
  tips.tipBox = $("#tipBox");
  const next = tips.nextTip()
  expect(next).toBeDefined()
})
