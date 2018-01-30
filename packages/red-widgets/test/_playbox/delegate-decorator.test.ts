import {
  createContainer,
  delegator,
  delegateTarget
} from '@tecla5/red-base'

const $log = console.log
interface IConfiguration {
}

// const devContainer = new EnvContainer({
//   name: 'development',
//   scope: 'dev',
//   default: true
// })

const container: any = createContainer({
  dev: 'development', // first is implicit default
  test: 'testing',
  prod: 'prouction'
}) // .setMode('create')
// containerMap.setDefault('development')

@delegateTarget({
  container,
  key: 'Configuration'
})
class MyConfiguration implements IConfiguration {
  constructor(parent: any) {
  }
}

interface IExecuter {
}

@delegateTarget({
  container,
  key: 'Executer' // override implicit class name key
})
class MyExecuter implements IExecuter {
  constructor(parent: any) {
  }
}

// if 'prod' environment container is not registered on main container
// it will be set on the default environment
// you can change this behavior, so that the main container
// will create the environment container if not found using setMode('create')

@delegateTarget({
  container,
  scope: 'prod' // production scope only
  // key: 'Executer' // use implicit key via class name
})
class Executer implements IExecuter {
  constructor(parent: any) {
  }
}


@delegator({
  container,
  map: {
    configuration: 'Configuration',
    executer: 'Executer',
  }
})
class MyPerson {
  public name: string;
  configuration: IConfiguration
  executer: IExecuter

  constructor(name: string = 'kristian') {
  }
}

test('delegates: default', () => {
  const person = new MyPerson('mike')

  expect(person.configuration.constructor).toBe(MyConfiguration)
  expect(person.executer.constructor).toBe(MyExecuter)
})

class MyTestConfiguration implements IConfiguration {

}

test('delegates: use test scope', () => {
  container
    .getScoped('test')
    .set('Configuration', MyTestConfiguration)

  container
    .setScope('test')

  const person = new MyPerson('mike')

  // container.getScoped('test').print()

  // use from test scope
  expect(person.configuration.constructor).toBe(MyTestConfiguration)

  // use default
  expect(person.executer.constructor).toBe(MyExecuter)
})
