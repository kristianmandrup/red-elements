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
  await user.login(opts)
  expect(user.loggedIn).toBeTruthy()
})

test('user: logout', async () => {
  let opts = {}
  await user.login(opts)
  expect(user.loggedIn).toBeTruthy()
  await user.logout()
  expect(user.loggedIn).toBeFalsy()
})

test('user: updateUserMenu', () => {
  user.updateUserMenu()
})
