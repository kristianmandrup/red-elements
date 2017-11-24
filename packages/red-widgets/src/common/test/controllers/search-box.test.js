import {
  readPage,
  ctx,
  RED,
  controllers
} from '../imports'

const {
  Searchbox
} = controllers

const clazz = Searchbox

const {
  log
} = console

beforeAll(() => {
  // create jquery UI widget via factory (ie. make available on jQuery elements)
  Searchbox(RED)

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('simple')
})

test('Searchbox: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Searchbox: widget can be created', () => {
  let elem = $('#search-box')
  // log({
  //   elem
  // })
  let widgetElem = elem.searchBox()
  // log({
  //   widgetElem
  // })
  expect(widgetElem).toBeDefined()
})

test('Seachbox: can clear search input box',()=>{
  let elem=$('#btnClear');

  let clickEvent=elem.click();
  expect(typeof elem.click).toBe('function')
});