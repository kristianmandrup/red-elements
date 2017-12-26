import {
  Bidi
} from '../..'

function create() {
  return new Bidi()
}

let bidi
test.beforeEach(() => {
  bidi = create()
})

test('Bidi: create', () => { })
