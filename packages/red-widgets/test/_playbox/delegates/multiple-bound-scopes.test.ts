import {
  createContainer,
  delegator,
  delegateTarget
} from '@tecla5/red-base'

const $log = console.log
interface IConfiguration {
}

interface IExecuter {
}

const container: any = createContainer({
  dev: 'development', // first is implicit default
  test: 'testing',
  prod: 'production'
}) // .setMode('create')


@delegateTarget({
  container,
  key: 'Executer' // override implicit class name key
})
class MyExecuter implements IExecuter {
  constructor(parent: any) {
  }
}


@delegateTarget({
  container,
  bind: {
    dev: '*', // use class name BoundExecuter
    test: 'IExecuter',
    prod: 'I', // IBoundExecuter
  }
})
class BoundExecuter implements IExecuter {
  constructor(parent: any) {
  }
}


@delegator({
  container,
  scope: 'test',
  map: {
    // should lookup the test entry made by BoundExecuter, ie. test: 'IExecuter'
    executer: 'IExecuter'
  }
})
class MyPerson {
  public name: string;
  configuration: IConfiguration
  executer: IExecuter

  constructor(name: string = 'kristian') {
  }
}

test('delegates: use bound/mapped test scope to IExecuter', () => {
  container
    .setScope('test')

  const person = new MyPerson('mike')

  // use default
  expect(person.executer.constructor).toBe(BoundExecuter)
})
