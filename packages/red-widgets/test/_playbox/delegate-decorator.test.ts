import {
  createContainer,
  delegates,
  delegate
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
})
// containerMap.setDefault('development')

@delegate({
  container,
  key: 'Configuration'
})
class MyConfiguration implements IConfiguration {
  constructor(parent: any) {
  }
}

interface IExecuter {
}

@delegate({
  container,
  key: 'Executer'
})
class MyExecuter implements IExecuter {
  constructor(parent: any) {
  }
}

@delegates({
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
