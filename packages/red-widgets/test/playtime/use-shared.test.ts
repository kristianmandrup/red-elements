import {
  A
} from '@tecla5/red-shared/src/tester'

test('A was imported', () => {
  console.log('A', A)
  expect(A).toBe(32)
})

