import { IKeyboard } from './interface';

import {
  d3,
  Context,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'
import { IActionKeyMap } from './interfaces';

export interface IKeyboardHandlerManager {
  /**
   * add Handler
   * @param scope
   * @param key
   * @param modifiers
   * @param ondown
   */
  addHandler(scope: any, key: string, modifiers: Function | string, ondown: Function | string)

  /**
   * remove Handler
   * @param key
   * @param modifiers
   */
  removeHandler(key: string, modifiers: any)
}

const TYPES = $TYPES.all

@delegateTarget()
export class KeyboardHandlerManager extends Context implements IKeyboardHandlerManager {
  public handlers = {};

  constructor(protected keyboard: IKeyboard) {
    super()
  }

  protected get actionToKeyMap() {
    return this.keyboard.actionToKeyMap
  }

  protected set actionToKeyMap(value) {
    this.keyboard.actionToKeyMap = value
  }


  /**
   * add Handler
   * @param scope
   * @param key
   * @param modifiers
   * @param ondown
   */
  addHandler(scope: any, key: string, modifiers: Function | string, ondown: Function | string) {
    const {
      actionToKeyMap,
      handlers
    } = this
    const {
      parseKeySpecifier
    } = this.rebind([
        'parseKeySpecifier'
      ])

    var mod: any = modifiers;
    var cbdown: Function | string = ondown;
    if (typeof modifiers == 'function' || typeof modifiers === 'string') {
      mod = {};
      cbdown = modifiers;
    }
    var keys = [];
    var i = 0;
    if (typeof key === 'string') {
      if (typeof cbdown === 'string') {
        log(`add (shortcut) to action map: ${cbdown}`, {
          actionToKeyMap,
          cbdown
        })
        actionToKeyMap[cbdown] = {
          scope: scope,
          key: key
        };
        if (typeof ondown === 'boolean') {
          actionToKeyMap[cbdown].user = ondown;
        }
      }
      // set instance var
      this.actionToKeyMap = actionToKeyMap

      var parts = key.split(' ');
      for (i = 0; i < parts.length; i++) {
        var parsedKey = parseKeySpecifier(parts[i]);
        if (parsedKey) {
          keys.push(parsedKey);
        } else {
          return;
        }
      }
    } else {
      keys.push([key, mod])
    }
    var slot: any = handlers;
    for (i = 0; i < keys.length; i++) {
      key = keys[i][0];
      mod = keys[i][1];
      if (mod.ctrl) {
        slot.ctrl = slot.ctrl || {};
        slot = slot.ctrl;
      }
      if (mod.shift) {
        slot.shift = slot.shift || {};
        slot = slot.shift;
      }
      if (mod.alt) {
        slot.alt = slot.alt || {};
        slot = slot.alt;
      }
      slot[key] = slot[key] || {};
      slot = slot[key];
      //slot[key] = {scope: scope, ondown:cbdown};
    }
    slot.scope = scope;
    slot.ondown = cbdown;
    return this
  }

  /**
   * remove Handler
   * @param key
   * @param modifiers
   */
  removeHandler(key: string, modifiers: any) {
    const {
      handlers,
      actionToKeyMap
    } = this

    const {
      parseKeySpecifier,
    } = this.rebind([
        'parseKeySpecifier'
      ])

    var mod: any = modifiers || {};
    var keys = [];
    var i = 0;
    if (typeof key === 'string') {

      var parts = key.split(' ');
      for (i = 0; i < parts.length; i++) {
        var parsedKey = parseKeySpecifier(parts[i]);
        if (parsedKey) {
          keys.push(parsedKey);
        } else {
          this.logWarning('Unrecognised key specifier:', {
            key
          })
          return this;
        }
      }
    } else {
      keys.push([key, mod])
    }
    var slot: any = handlers;
    for (i = 0; i < keys.length; i++) {
      key = keys[i][0];
      mod = keys[i][1];
      if (mod.ctrl) {
        slot = slot.ctrl;
      }
      if (slot && mod.shift) {
        slot = slot.shift;
      }
      if (slot && mod.alt) {
        slot = slot.alt;
      }
      if (!slot[key]) {
        return this;
      }
      slot = slot[key];
    }
    if (typeof slot.ondown === 'string') {
      if (typeof modifiers === 'boolean' && modifiers) {
        actionToKeyMap[slot.ondown] = {
          user: modifiers
        }
      } else {
        delete actionToKeyMap[slot.ondown];
      }
    }
    delete slot.scope;
    delete slot.ondown;
    return this
  }
}
