/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  isIOS,
  isMac,
  isMacLike,
  cmdCtrlKey,
  metaKeyCodes,
  keyMap,
  firefoxKeyCodeMap
} from './codes'

import {
  I18nElem,
  IActionKeyMap,
  IEditableList,
  ISearchBox
} from './interfaces'

import {
  Context,
  $,
  Searchbox
} from '../../common'

import {
  IKeyboardConfiguration
} from './configuration';

import {
  IKeyboardHandlerManager
} from './handler-manager';

import {
  IKeyboardLoader
} from './loader';

import {
  delegator,
  delegateTo
} from './_base'

import {
  IKeyboard
} from './interface'
import { JQElem } from '../../_interfaces/index';
import { IKeyboardSettingsDisplay } from './display';

@delegator({
  map: {
    configuration: 'IKeyboardConfiguration',
    handlerManager: 'IKeyboardHandlerManager',
    loader: 'IKeyboardLoader',
    display: 'IKeyboardSettingsDisplay'
  }
})
export class Keyboard extends Context {
  public handlers = {};
  public partialState = null;
  public actionToKeyMap: IActionKeyMap = {}
  public defaultKeyMap: Object = {};
  public mainElement: HTMLElement

  protected configuration: IKeyboardConfiguration
  protected handlerManager: IKeyboardHandlerManager
  protected loader: IKeyboardLoader
  protected display: IKeyboardSettingsDisplay

  constructor() {
    super()
    this.configure()
  }

  add(scope: any, key: string, id: string, x?: boolean) {
    this.handleError('add(...args) Not yet implemented')
  }

  /**
  * Configure Keyboard
  */
  configure() {
    this.configuration.configure()
    return this
  }

  /**
   * format Key
   * @param key
   */
  formatKey(key: string): string {
    var formattedKey = isMac ? key.replace(/ctrl-?/, '&#8984;') : key;
    formattedKey = isMac ? formattedKey.replace(/alt-?/, '&#8997;') : key;
    formattedKey = formattedKey.replace(/shift-?/, '&#8679;')
    formattedKey = formattedKey.replace(/left/, '&#x2190;')
    formattedKey = formattedKey.replace(/up/, '&#x2191;')
    formattedKey = formattedKey.replace(/right/, '&#x2192;')
    formattedKey = formattedKey.replace(/down/, '&#x2193;')
    return '<span class="help - key - block"><span class="help - key">' + formattedKey.split(' ').join('</span> <span class="help - key">') + '</span></span>';
  }

  /**
   * validate Key
   * @param key
   */
  validateKey(key: string): boolean {
    const {
      parseKeySpecifier
    } = this.rebind([
        'parseKeySpecifier'
      ])

    key = key.trim();
    var parts = key.split(' ');
    for (var i = 0; i < parts.length; i++) {
      var parsedKey = parseKeySpecifier(parts[i]);
      if (!parsedKey) {
        return false;
      }
    }
    return true;
  }


  /**
   * display keyboard Settings Pane
   */
  @delegateTo('display')
  getSettingsPane(): JQElem {
    return this.display.getSettingsPane()
  }

  /**
   * revert To Default
   * @param action
   */
  revertToDefault(action: string) {
    const {
      actionToKeyMap,
      defaultKeyMap
    } = this

    const {
      removeHandler,
      addHandler,
      _validateStr
    } = this.rebind([
        'removeHandler',
        'addHandler',
        '_validateStr'
      ], this)

    _validateStr(action, 'action', 'revertToDefault')

    var currentAction = actionToKeyMap[action];
    if (currentAction) {
      removeHandler(currentAction.key);
    } else {
      this.logWarning('no such action/key mapping registered', {
        actionToKeyMap,
        action
      })
    }

    if (defaultKeyMap.hasOwnProperty(action)) {
      var obj = defaultKeyMap[action];
      addHandler(obj.scope, obj.key, action, false);
    } {
      this.logWarning('no such action in defaultKeyMap', {
        defaultKeyMap,
        action
      })
    }
    return this
  }

  /**
   * parse Key Specifier
   * @param key
   */
  parseKeySpecifier(key: string) {
    this._validateStr(key, 'key', 'parseKeySpecifier')

    var parts = key.toLowerCase().split('-');
    var modifiers = {
      ctrl: false,
      meta: false,
      alt: false,
      shift: false
    };
    var keycode;
    var blank = 0;
    for (var i = 0; i < parts.length; i++) {
      switch (parts[i]) {
        case 'ctrl':
        case 'cmd':
          modifiers.ctrl = true;
          modifiers.meta = true;
          break;
        case 'alt':
          modifiers.alt = true;
          break;
        case 'shift':
          modifiers.shift = true;
          break;
        case '':
          blank++;
          keycode = keyMap['-'];
          break;
        default:
          if (keyMap.hasOwnProperty(parts[i])) {
            keycode = keyMap[parts[i]];
          } else if (parts[i].length > 1) {
            return null;
          } else {
            keycode = parts[i].toUpperCase().charCodeAt(0);
          }
          break;
      }
    }
    return [keycode, modifiers];
  }

}
