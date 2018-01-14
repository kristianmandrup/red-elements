export interface ILocalStorage {
  hasLocalStorage: () => boolean
  set: (key: string, value: any) => void
  get: (key: string) => string
}

export class LocalStorage implements ILocalStorage {
  constructor(public options = {}) {
  }

  hasLocalStorage(): boolean {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  };

  set(key, value): void {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(value));
  };

  /**
   * If the key is not set in the localStorage it returns <i>undefined</i>
   * Else return the JSON parsed value
   * @param key
   * @returns {*}
   */
  get(key): string {
    if (!this.hasLocalStorage()) {
      return undefined;
    }
    return JSON.parse(localStorage.getItem(key));
  };

  remove(key) {
    if (!this.hasLocalStorage()) {
      return;
    }
    localStorage.removeItem(key);
  };
}
