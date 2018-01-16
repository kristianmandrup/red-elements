export interface ILocalStorage {
  hasLocalStorage: () => boolean
  set: (key: string, value: any) => void
  get: (key: string) => string
}

export class LocalStorage implements ILocalStorage {
  constructor(public options = {}) {
  }

  /**
   * Determine if localstorage available in browser
   * @returns { boolean } whether localstorage is available in browser
   */
  hasLocalStorage(): boolean {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  };

  /**
   * Set entry of localstorage
   * @param key { string } key (index) to set for
   * @param value { string } value to set
   */
  set(key: string, value: string): LocalStorage {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
    return this
  }

  /**
   * If the key is not set in the localStorage it returns <i>undefined</i>
   * Else return the JSON parsed value
   * @param key
   * @returns {*}
   */
  get(key: string): string {
    if (!this.hasLocalStorage()) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem(key));
  }

  /**
   * Remove an entry from localstorage
   * @param key
   */
  remove(key: string): LocalStorage {
    if (!this.hasLocalStorage()) {
      return this;
    }
    localStorage.removeItem(key);
    return this
  }
}
