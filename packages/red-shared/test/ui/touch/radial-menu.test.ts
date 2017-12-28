import {
  RadialMenu
} from '../../..'

function create() {
  return new RadialMenu()
}

let menu
beforeEach(() => {
  menu = create()
})

test('RadialMenu: create', () => {
  expect(menu).toBeDefined()
})
