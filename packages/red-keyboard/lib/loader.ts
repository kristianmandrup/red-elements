import { IKeyboard } from './interface';

import {
  d3,
  Context,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'
import { ISettings } from '../../../../red-runtime/src/index';

const TYPES = $TYPES.all

export interface IKeyboardLoader {
  loadKeyMap()
}

@delegateTarget()
export class KeyboardLoader extends Context implements IKeyboardLoader {
  @lazyInject(TYPES.settings) $settings: ISettings

  constructor(protected keyboard: IKeyboard) {
    super()
  }

  /**
   * load Key Map
   */
  loadKeyMap() {
    const {
      keyboard,
      $settings
    } = this
    const {
      defaultKeyMap,
    } = keyboard
    const {
      addHandler
    } = this.rebind([
        'addHandler',
      ], keyboard)

    const userKeymap = $settings.get('keymap') || {};

    $.getJSON('red/keymap.json', function (data) {
      for (var scope in data) {
        if (data.hasOwnProperty(scope)) {
          var keys = data[scope];
          for (var key in keys) {
            if (keys.hasOwnProperty(key)) {
              if (!userKeymap.hasOwnProperty(keys[key])) {
                addHandler(scope, key, keys[key], false);
                defaultKeyMap[keys[key]] = {
                  scope: scope,
                  key: key,
                  user: false
                };
              }
            }
          }
        }
      }

      for (var action in userKeymap) {
        if (userKeymap.hasOwnProperty(action)) {
          var obj = userKeymap[action];
          if (obj.hasOwnProperty('key')) {
            addHandler(obj.scope, obj.key, action, true);
          }
        }
      }
    });
  }
}
