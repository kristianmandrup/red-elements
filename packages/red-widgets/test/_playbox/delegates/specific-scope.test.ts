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
  prod: 'production'
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
  // implicit current scope (dev)
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

class MyTestConfiguration implements IConfiguration {

}

test('delegates: use test scope', () => {
  container
    .getScoped('test')
    .set('Configuration', MyTestConfiguration)
    // can now also efficiently set multiple mappings like this:
    .setMap({
      Configuration: MyTestConfiguration,
      IExecuter: MyExecuter
    })

  // switch to test scope
  container
    .setScope('test')

  container.print('test container map')

  const person = new MyPerson('mike')

  container.getScoped('test').print('test container')

  // use from test scope
  expect(person.configuration.constructor).toBe(MyTestConfiguration)

  // use default
  expect(person.executer.constructor).toBe(MyExecuter)
})

