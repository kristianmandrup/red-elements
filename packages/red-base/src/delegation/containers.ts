export interface ContainerConfig {
  name?: string
  scope?: string
  default?: boolean
}

export class BaseContainer {
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

export class EnvContainer extends BaseContainer {
}

export class ContainerMap extends BaseContainer {
  default: EnvContainer = null

  resolve(containerName) {
    const resolved = this.scopedContainer.get(containerName) || this.default.get(containerName)
    if (!resolved) {
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

// factory for creating containers for multiple envs
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
