import {
  delegateTo
} from '@tecla5/red-base'

interface IDelegate {
  ok: boolean
}

class TestMe {
  constructor(public myDelegate: IDelegate) {

  }

  @delegateTo('myDelegate')
  delegatorFun(): string {
    return 'must be delegated'
  }
}

class Delegate implements IDelegate {
  ok = true

  delegatorFun(): string {
    return `success: ${this.ok}`
  }
}

class BadDelegate implements IDelegate {
  ok = true

  _delegatorFun(): string {
    return `success: ${this.ok}`
  }
}


test('delegates delegatorFun call to instance method of delegate class', () => {
  const delegate = new Delegate()
  const result = new TestMe(delegate).delegatorFun()
  expect(result).toEqual('success: true')
})

test('delegates call to instance method defaults to own if no delegatorFun function in delegate class', () => {
  const delegate = new BadDelegate()
  const result = new TestMe(delegate).delegatorFun()
  expect(result).toEqual('must be delegated')
})
