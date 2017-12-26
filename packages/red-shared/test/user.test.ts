import {
  User
} from '../'

function create() {
  return new User()
}

let user
beforeEach(() => {
  user = create()
})

test('user: create', () => {
  expect(typeof user).toBe('object')
})

test('user: login', async () => {
  // fix - should be async via promise, not done callback
  let opts = {}
  await user.login(opts, done)

  // TODO: use nightmare to test that screen is updated as expected
})

test('user: logout', async () => {
  let opts = {}
  await user.login(opts, done)
  await user.logout()

  // TODO: use nightmare to test that screen is updated as expected
})

test('user: updateUserMenu', () => {
  user.updateUserMenu()

  // TODO: use nightmare to test that screen is updated as expected
})
