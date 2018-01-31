import { EnvContainer } from "./env-container";
import { BaseContainer } from "./base-container";

export class ContainerMap extends BaseContainer {
  default: EnvContainer = null
  createMode: boolean = false

  /**
   *
   * @param container
   */
  mergeInto(container: ContainerMap) {
    return super.mergeInto(container)
  }

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
          scoped: this.scopedContainer.scopeBindings,
          default: this.default.scopeBindings
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
    this.setScope(scope)
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
