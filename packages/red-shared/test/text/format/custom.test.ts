import {
  format
} from '../../..'

const {
  custom
} = format

test('custom: structure', () => {
  t.is(typeof custom, 'object')
  t.is(typeof custom.format, 'function')
})

//
test('custom: format', () => {
  let content = 'xyz'
  t.truthy(custom.format(content))
})