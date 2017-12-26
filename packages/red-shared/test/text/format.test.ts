import {
  TextFormat
} from '../..'

function create() {
  return new TextFormat()
}

let tf
test.beforeEach(() => {
  tf = create()
})

test('TextFormat: create', () => { })
