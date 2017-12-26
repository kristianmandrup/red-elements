import {
  TextFormat
} from '../..'

function create() {
  return new TextFormat()
}

let tf
beforeEach(() => {
  tf = create()
})

test('TextFormat: create', () => {
  expect(typeof tf).toBe('object')
})
