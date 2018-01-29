export interface ContainerConfig {
  name?: string
  scope?: string
  default?: boolean
}

/**
 *
 */
export class BaseContainer {
  protected _name: string
  protected _scope: string

  protected _map = new Map()

  constructor(config: ContainerConfig = {}) {
    this._name = config.name
    this._scope = config.scope
  }

  /**
   *
   */
  print() {
    console.log({
      name: this.name,
      scope: this.scope,
      keys: this.keys,
      map: this._map
    })
  }

  /**
   *
   * @param scope
   */
  setScope(scope: string): BaseContainer {
    this._scope = scope
    return this
  }

  /**
   *
   */
  get keys() {
    return Array.from(this._map.keys())
  }

  /**
   *
   */
  get scope() {
    return this._scope || 'dev'
  }

  /**
   *
   */
  get name() {
    return this._name || 'default'
  }

  /**
   *
   * @param key
   * @param clazz
   */
  set(key: string, clazz) {
    this._map.set(key, clazz)
    return this
  }

  /**
   *
   * @param key
   * @param clazz
   */
  delete(key: string, clazz) {
    this._map.delete(key)
    return this
  }

  /**
   *
   * @param key
   */
  get(key: string) {
    return this._map.get(key)
  }

  /**
   *
   * @param id
   */
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

  /**
   *
   */
  clear() {
    this._map = new Map()
    return this
  }
}

/**
 *
 */
export class EnvContainer extends BaseContainer {
}

/**
 *
 */
export class ContainerMap extends BaseContainer {
  default: EnvContainer = null
  createMode: boolean = false

  /**
   *
   * @param containerName
   */
  resolve(containerName) {
    const resolved = this.scopedContainer.get(containerName) || this.default.get(containerName)
    if (!resolved) {
      const errMsg = `Unable to resolve ${containerName} in either scoped (${this.scope}) or default container`
      console.error(errMsg, {
        containerName,
        containers: {
          scoped: this.scopedContainer.keys,
          default: this.default.keys
        }
      })
      throw new Error(errMsg)
    }
    return resolved
  }

  /**
   *
   */
  get scopedContainer() {
    return this.getScoped(this.scope)
  }

  /**
   *
   * @param scope
   */
  setScopedAsDefault(scope: string): BaseContainer {
    super.setScope(scope)
    this.setDefault(this.scopedContainer)
    return this
  }

  /**
   *
   * @param mode
   */
  setMode(mode: 'create' | 'default') {
    this.createMode = mode === 'create'
    return this
  }

  /**
   *
   * @param containerId
   */
  setDefault(containerId) {
    this.default = this.find(containerId)
    return this
  }

  /**
   *
   * @param scope
   */
  getScoped(scope) {
    return Array.from(this._map.values()).find(container => container.scope === scope)
  }

  /**
   *
   * @param scope
   * @param name
   */
  createScoped(scope, name?) {
    name = name || scope
    const scopeContainer = new EnvContainer({
      name,
      scope
    })
    this.set(name, scopeContainer)
    return scopeContainer
  }

  /**
   *
   * @param scope
   */
  getScopedOrDefault(scope) {
    return this.getScoped(scope) || this.default
  }

  /**
   *
   * @param scope
   * @param name
   */
  getScopedOrCreate(scope, name?) {
    return this.getScoped(scope) || this.createScoped(scope, name)
  }

  /**
   *
   * @param scope
   * @param name
   */
  getScopedEnv(scope, name?) {
    if (!scope || scope === 'default') return this.default
    return this.createMode ? this.getScopedOrCreate(scope, name) : this.getScopedOrDefault(scope)
  }
}

/**
 * Factory for creating a main container (ContainerMap) with an EnvContainer map
 * @param config
 */
export function createContainer(config: any): ContainerMap {
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
