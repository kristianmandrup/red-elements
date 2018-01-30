import {
  callDelegate
} from '@tecla5/red-base'

interface IDelegate {
  ok: boolean
}

class TestMe {
  constructor(public myDelegate: IDelegate) {

  }

  @callDelegate('myDelegate')
  delegator(): string {
    return 'must be delegated'
  }
}

class Delegate implements IDelegate {
  ok = true

  delegator(): string {
    return `success: ${this.ok}`
  }
}

class BadDelegate implements IDelegate {
  ok = true

  _delegator(): string {
    return `success: ${this.ok}`
  }
}


test('delegates call to instance method of delegate class', () => {
  const delegate = new Delegate()
  const result = new TestMe(delegate).delegator()
  expect(result).toEqual('success: true')
})

test('delegates call to instance method defaults to own if no delegator function in delegate class', () => {
  const delegate = new BadDelegate()
  const result = new TestMe(delegate).delegator()
  expect(result).toEqual('must be delegated')
})
