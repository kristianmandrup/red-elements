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
  new Searchbox()

  // load document with placeholder elements to create widgets (for testing)
  document.documentElement.innerHTML = readPage('../red-widgets/src/test/app/simple');
})

test('Searchbox: is a class', () => {
  expect(typeof clazz).toBe('function')
})

test('Searchbox: widget can be created', () => {
  let elem = $('#search-box')
  // log({
  //   elem
  // })
  let widgetElem = elem.searchBox();
  // log({
  //   widgetElem
  // })
  expect(widgetElem).toBeDefined()
})

test('Searchbox: can clear search input box', () => {
  let elem = $('.btnClear');

  let clickEvent = elem.click();
  expect(typeof elem.click).toBe('function')
});

test('Searchbox: count', () => {
  let searchBox = $('#search-box').searchBox();
  searchBox.searchBox('count');
  expect($(".red-ui-searchBox-resultCount").text().length).toBe(0);
  expect($(".red-ui-searchBox-resultCount").is(':visible')).toBe(false);
});

test('Searchbox: count with null parameter', () => {
  let searchBox = $('#search-box').searchBox();
  searchBox.searchBox('count', null);
  expect($(".red-ui-searchBox-resultCount").text().length).toBe(0);
  expect($(".red-ui-searchBox-resultCount").is(':visible')).toBe(false);
});

test('Searchbox: count with empty string parameter', () => {
  let searchBox = $('#search-box').searchBox();
  searchBox.searchBox('count', "");
  expect($(".red-ui-searchBox-resultCount").text().length).toBe(0);
  expect($(".red-ui-searchBox-resultCount").is(':visible')).toBe(false);
});

test('Searchbox: count with value', () => {
  let searchBox = $('#search-box').searchBox();
  searchBox.searchBox('count', "search-text");
  expect($(".red-ui-searchBox-resultCount").text()).toBe("search-text");
  expect($(".red-ui-searchBox-resultCount").css("display")).not.toBe("none");
});

test('Searchbox: change search text', () => {
  let searchBox = $('#search-box').searchBox();
  searchBox.searchBox('change');
  expect($(".btnClear").is(":visible")).toBe(false);
});

test('Searchbox: change get search text value', () => {
  let searchBox = $('#search-box').searchBox();
  searchBox.searchBox('value', "search-text");
  expect(searchBox.searchBox('value')).toBe("search-text");
});

test('Searchbox: clear search text on escape button', () => {
  let searchBox = $('#search-box').searchBox();
  var e = $.Event('keydown');
  e.keyCode = 27; // Character 'escape'
  searchBox.trigger(e);
});

test('Searchbox: do not clear search text if escape button not pressed', () => {
  let searchBox = $('#search-box').searchBox();
  var e = $.Event('keydown');
  e.keyCode = 65; // Character 'A'
  searchBox.trigger(e);
});

test('Searchbox: change search text on key up', () => {
  let searchBox = $('#search-box').searchBox();
  var e = $.Event('keyup');
  e.val = function () {
    return "search text";
  }
  searchBox.trigger(e);
});


// test('Searchbox: change search text with new value', () => {
//   let searchBox = $('#search-box').searchBox();
//   searchBox.searchBox('change');
//   searchBox.searchBox('value','text');
//   expect($(".btnClear").is(":visible")).toBe(false);
// });
