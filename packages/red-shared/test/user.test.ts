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

test.only('user: onLoginSuccess', async () => {
  let opts = {
    cancelable: false,
    updateMenu: null
  }
  let data = {}
  const result: any = await new Promise((resolve, reject) => {
    user.onLoginSuccess({ resolve, reject, data, opts })
  })

  expect(result.loggedIn).toBeTruthy()
})

test.only('user: login', async () => {
  let opts = {
    cancelable: false,
    updateMenu: null
  }
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
