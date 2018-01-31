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
  print(msg?) {
    msg = msg || this.constructor.name
    console.log(msg, {
      name: this.name,
      scope: this.scope,
      keys: this.keys,
      map: this._map
    })
  }

  get scopeBindings() {
    // ensure we don't return real map that allow for modifications
    return Object.assign({}, this._map)
  }

  /**
   *
   * @param scope
   */
  setScope(scope: string): BaseContainer {
    this._scope = scope
    return this
  }

  mergeInto(container: BaseContainer) {
    this._map.forEach((key, value) => {
      container.set(key, value)
    });
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
