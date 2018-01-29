const $log = console.log
interface IConfiguration {

}

interface ContainerConfig {
  name?: string
  scope?: string
  default?: boolean
}

class BaseContainer {
  protected _name: string
  protected _scope: string

  protected _map = new Map()

  constructor(config: ContainerConfig = {}) {
    this._name = config.name
    this._scope = config.scope
  }

  print() {
    console.log({
      name: this.name,
      scope: this.scope,
      map: this._map
    })
  }

  setScope(scope: string): BaseContainer {
    this._scope = scope
    return this
  }

  get scope() {
    return this._scope || 'dev'
  }

  get name() {
    return this._name || 'default'
  }

  set(key: string, clazz) {
    this._map.set(key, clazz)
    return this
  }

  delete(key: string, clazz) {
    this._map.delete(key)
    return this
  }

  get(key: string) {
    $log('get', key, this._map)
    return this._map.get(key)
  }

  find(id) {
    const found = typeof id === 'string' ? this.get(id) : id
    if (!found) {
      console.error(`Container ${id} not found`, {
        map: this._map
      })
      return this
    }
    return found
  }

  clear() {
    this._map = new Map()
    return this
  }
}

class EnvContainer extends BaseContainer {
}

class ContainerMap extends BaseContainer {
  default: EnvContainer = null

  resolve(containerName) {
    $log('resolve', containerName, {
      scoped: this.scopedContainer,
      default: this.default
    })
    // const scopedFound = this.scopedContainer.get(containerName)
    // const defaultFound = this.default.get(containerName)
    // const resolved = scopedFound || defaultFound
    this.scopedContainer.print()
    this.default.print()

    const resolved = this.scopedContainer.get(containerName) || this.default.get(containerName)
    if (!resolved) {
      // console.error({
      //   defaultFound,
      //   scopedFound
      // })
      throw new Error(`Unable to resolve ${containerName} in either scoped (${this.scope}) or default container`)
    }
    return resolved
  }

  get scopedContainer() {
    return this.getScoped(this.scope)
  }

  setScopedAsDefault(scope: string): BaseContainer {
    super.setScope(scope)
    this.setDefault(this.scopedContainer)
    return this
  }

  setDefault(containerId) {
    this.default = this.find(containerId)
    return this
  }

  getScoped(scope) {
    return Array.from(this._map.values()).find(container => container.scope === scope)
  }

  getScopedOrDefault(scope) {
    return this.getScoped(scope) || this.default
  }
}

const devContainer = new EnvContainer({
  scope: 'dev',
  default: true
})

const testContainer = new EnvContainer({
  scope: 'test'
})

const container = new EnvContainer()

// factory for creating containers for multiple envs
function createContainerMap(config: any): ContainerMap {
  const containerMap = new ContainerMap()
  Object.keys(config).map((key, index) => {
    const name = config[key]

    const envContainer = new EnvContainer({
      name,
      scope: key
    })

    containerMap.set(name, envContainer)
    if (index === 0) {
      containerMap.setDefault(envContainer)
    }
  })
  return containerMap
}

const containerMap: any = createContainerMap({
  dev: 'development', // first is implicit default
  test: 'testing',
})

containerMap.setDefault('development')

@delegate({
  containerMap,
  key: 'Configuration'
})
class MyConfiguration implements IConfiguration {
  constructor(parent: any) {
    $log('MyConfiguration', {
      parent
    })
  }
}

interface IExecuter {

}

@delegate({
  containerMap,
  key: 'Executer'
})
class MyExecuter implements IExecuter {
  constructor(parent: any) {
    $log('MyExecuter', {
      parent
    })
  }
}

@delegates({
  containerMap,
  delegates: {
    configuration: 'Configuration',
    executer: 'Executer',
  }
})
class MyPerson {
  public name: string;
  configuration: IConfiguration
  executer: IExecuter

  constructor(name: string = 'kristian') {
    $log('MyPerson', {
      name
    })
  }
}

function delegate(config: any) {
  const {
    containerMap,
    scope,
    key
  } = config

  return (target: Object) => {
    $log('register with container', {
      key,
      target,
      container
    })
    containerMap.getScopedOrDefault(scope).set(key, target)
  }
}


function delegates(config: any) {
  const {
    containerMap,
    delegates
  } = config

  // $log('delegates', {
  //   delegates
  // })

  return (target: Object) => {
    // $log('logClass', {
    //   target
    // })

    // implement class decorator here, the class decorator
    // will have access to the decorator arguments (filter)
    // because they are  stored in a closure


    // save a reference to the original constructor
    var original: any = target;

    // a utility function to generate instances of a class
    function construct(constructor, args) {
      var c: any = function () {
        return constructor.apply(this, args);
      }
      c.prototype = constructor.prototype;
      return new c();
    }

    // the new constructor behaviour
    var f: any = function (...args) {
      const constructed = construct(original, args);

      Object.keys(delegates).map(key => {
        const clazzName = delegates[key]

        $log(`resolve ${clazzName} in constructor`, {
          containerMap
        })

        // TODO: look up class in container of inversify
        const clazz = containerMap.resolve(clazzName)
        $log('found in container', {
          clazzName,
          clazz
        })

        constructed[key] = new clazz(constructed)
      })
      return constructed
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;

    // return new constructor (will override original)
    return f;
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
  containerMap
    .getScoped('test')
    .set('Configuration', MyTestConfiguration)

  containerMap
    .setScope('test')

  const person = new MyPerson('mike')

  containerMap.getScoped('test').print()

  // use from test scope
  expect(person.configuration.constructor).toBe(MyTestConfiguration)

  // use default
  expect(person.executer.constructor).toBe(MyExecuter)
})
