import { Keyboard, Searchbox } from '../../';

import {
  d3,
  Context,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'


import { IUserSettings } from '../../user-settings/lib/interface';
import { II18n } from '../../../../red-runtime/src/i18n/interface';
import { IActions } from '../../actions/lib/interface';
import { IKeyboard } from './interface';

import {
  metaKeyCodes,
  firefoxKeyCodeMap
} from './codes'

import {
  I18nElem,
  IActionKeyMap,
  IEditableList,
  ISearchBox
} from './interfaces'
import { ISettings } from '../../../../red-runtime/src/index';

export interface IKeyboardConfiguration {
  configure()
}

const TYPES = $TYPES.all

@delegateTarget()
export class KeyboardConfiguration extends Context implements IKeyboardConfiguration {
  disabled: boolean

  public handlers = {};
  public partialState = null;
  public actionToKeyMap: IActionKeyMap = {}
  public defaultKeyMap = {};

  @lazyInject(TYPES.userSettings) $userSettings: IUserSettings
  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.keyboard) $keyboard: IKeyboard
  @lazyInject(TYPES.settings) $settings: ISettings

  constructor(protected keyboard: Keyboard) {
    super()
  }

  /**
   * Configure
   */
  configure() {
    // TODO:
    // somehow use SearchBox widget from red-widgets (possibly move all common widgets to red-runtime)
    // avoid circular dependency!

    // make Searchbox widget factory available on all jQuery elements
    new Searchbox()

    const {
      defaultKeyMap,
      actionToKeyMap,
      $userSettings,
      $i18n,
      $actions
    } = this

    const {
      getSettingsPane,
      resolveKeyEvent,
      addHandler,
      loadKeyMap
    } = this.rebind([
        'getSettingsPane',
        'resolveKeyEvent',
        'addHandler',
        'loadKeyMap'
      ])

    loadKeyMap()

    $userSettings.add({
      id: 'keyboard',
      title: $i18n.t('keyboard.keyboard'),
      get: getSettingsPane,
      focus: function () {
        setTimeout(function () {
          $('#user-settings-tab-keyboard-filter').focus();
        }, 200);
      }
    })

    const $window = d3.select(window)
    $window.on('keydown', function () {
      if (metaKeyCodes[d3.event.keyCode]) {
        return;
      }
      var handler = resolveKeyEvent(d3.event);
      if (handler && handler.ondown) {
        if (typeof handler.ondown === 'string') {
          $actions.invoke(handler.ondown);
        } else {
          handler.ondown();
        }
        d3.event.preventDefault();
      }
    });

  }

  /**
   * resolve Key Event
   * @param evt
   */
  resolveKeyEvent(evt) {
    let {
      partialState,
      handlers,
    } = this
    const {
      resolveKeyEvent
    } = this.rebind([
        'resolveKeyEvent'
      ])

    var slot = partialState || handlers;
    if (evt.ctrlKey || evt.metaKey) {
      slot = slot.ctrl;
    }
    if (slot && evt.shiftKey) {
      slot = slot.shift;
    }
    if (slot && evt.altKey) {
      slot = slot.alt;
    }
    var keyCode = firefoxKeyCodeMap[evt.keyCode] || evt.keyCode;
    if (slot && slot[keyCode]) {
      var handler = slot[keyCode];
      if (!handler.scope) {
        if (partialState) {
          partialState = null;
          return resolveKeyEvent(evt);
        } else if (Object.keys(handler).length > 0) {
          partialState = handler;
          evt.preventDefault();
          return null;
        } else {
          return null;
        }
      } else if (handler.scope && handler.scope !== '*') {
        var target = evt.target;
        while (target.nodeName !== 'BODY' && target.id !== handler.scope) {
          target = target.parentElement;
        }
        if (target.nodeName === 'BODY') {
          handler = null;
        }
      }
      partialState = null;
      return handler;
    } else if (partialState) {
      partialState = null;
      return resolveKeyEvent(evt);
    }
    return this
  }
}
