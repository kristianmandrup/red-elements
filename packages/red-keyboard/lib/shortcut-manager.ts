import { IKeyboard } from './interface';

import {
  d3,
  Context,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'
import { ISettings } from '../../../../red-runtime/src/index';
import { IUserSettings } from '../../user-settings/lib/interface';
import { II18n } from '../../../../red-runtime/src/i18n/interface';
import { IActions } from '../../actions/lib/interface';

import {
  I18nElem
} from './interfaces'


const TYPES = $TYPES.all

export interface IKeyboardShortcutManager {
}

@delegateTarget()
export class KeyboardShortcutManager extends Context implements IKeyboardShortcutManager {
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.userSettings) $userSettings: IUserSettings
  @lazyInject(TYPES.i18n) $i18n: II18n
  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.keyboard) $keyboard: IKeyboard

  constructor(protected keyboard: IKeyboard) {
    super()
  }

  /**
   * edit shortcut
   * @param e
   * @param container
   */
  editShortcut(e, container?) {
    const {
      $i18n,
      $keyboard,
      $settings
    } = this
    const {
      buildShortcutRow,
      endEditShortcut,
      _validateObj
    } = this.rebind([
        'endEditShortcut',
        'buildShortcutRow',
        '_validateObj'
      ])

    e.preventDefault();

    // TODO: Fix container reference this (see original node-red code)
    container = container || $(this);
    var object = container.data('data');

    _validateObj(object, 'object', 'endEditShortcut')

    log('editShortcut', {
      container,
      object
    })

    if (!container.hasClass('keyboard-shortcut-entry-expanded')) {
      endEditShortcut();

      var key = container.find('.keyboard-shortcut-entry-key');
      var scope = container.find('.keyboard-shortcut-entry-scope');
      container.addClass('keyboard-shortcut-entry-expanded');

      var keyInput = $('<input type="text">').attr('placeholder', $i18n.t('keyboard.unassigned')).val(object.key || '').appendTo(key);
      keyInput.on('keyup', function (e) {
        if (e.keyCode === 13) {
          return endEditShortcut();
        }
        var currentVal = String($(this).val());
        currentVal = currentVal.trim();
        var valid = (currentVal === '' || $keyboard.validateKey(currentVal));
        $(this).toggleClass('input-error', !valid);
      })

      var scopeSelect = <I18nElem>$('<select><option value="*" data-i18n="keyboard.global"></option><option value="workspace" data-i18n="keyboard.workspace"></option></select>').appendTo(scope);
      scopeSelect.i18n();
      scopeSelect.val(object.scope || '*');

      var div = $('<div class="keyboard-shortcut-edit button-group-vertical"></div>').appendTo(scope);
      var okButton = $('<button class="editor-button editor-button-small"><i class="fa fa-check"></i></button>').appendTo(div);
      var revertButton = $('<button class="editor-button editor-button-small"><i class="fa fa-reply"></i></button>').appendTo(div);

      okButton.click(function (e) {
        e.stopPropagation();
        endEditShortcut();
      });
      revertButton.click(function (e) {
        e.stopPropagation();
        $keyboard.revertToDefault(object.id);
        container.empty();
        container.removeClass('keyboard-shortcut-entry-expanded');
        var shortcut = $keyboard.getShortcut(object.id);
        var userKeymap = $settings.get('keymap') || {};
        delete userKeymap[object.id];
        $settings.set('keymap', userKeymap);

        var obj = {
          id: object.id,
          scope: shortcut ? shortcut.scope : undefined,
          key: shortcut ? shortcut.key : undefined,
          user: shortcut ? shortcut.user : undefined
        }
        buildShortcutRow(container, obj);
      })

      keyInput.focus();
    }
    return this
  }

  /**
   *
   * @param cancel
   */
  endEditShortcut(cancel: boolean) {
    const {
      $keyboard,
      $i18n,
      $settings
    } = this

    var container = $('.keyboard-shortcut-entry-expanded');
    if (container.length === 1) {
      var object = container.data('data');
      var keyInput = container.find('.keyboard-shortcut-entry-key input');
      var scopeSelect = container.find('.keyboard-shortcut-entry-scope select');
      if (!cancel) {
        var key = String(keyInput.val()).trim();
        var scope = String(scopeSelect.val());
        var valid = (key === '' || $keyboard.validateKey(key));
        if (valid) {
          var current = $keyboard.getShortcut(object.id);
          if ((!current && key) || (current && (current.scope !== scope || current.key !== key))) {
            var keyDiv = container.find('.keyboard-shortcut-entry-key');
            var scopeDiv = container.find('.keyboard-shortcut-entry-scope');
            keyDiv.empty();
            scopeDiv.empty();
            if (object.key) {
              $keyboard.remove(object.key, true);
            }
            container.find('.keyboard-shortcut-entry-text i').css('opacity', 1);
            if (key === '') {
              keyDiv.parent().addClass('keyboard-shortcut-entry-unassigned');
              keyDiv.append($('<span>').text($i18n.t('keyboard.unassigned')));
              delete object.key;
              delete object.scope;
            } else {
              keyDiv.parent().removeClass('keyboard-shortcut-entry-unassigned');
              keyDiv.append($keyboard.formatKey(key))
              $('<span>').text(scope).appendTo(scopeDiv);
              object.key = key;
              object.scope = scope;
              $keyboard.add(object.scope, object.key, object.id, true);
            }
            var userKeymap = $settings.get('keymap') || {};
            userKeymap[object.id] = $keyboard.getShortcut(object.id);
            $settings.set('keymap', userKeymap);
          }
        }
      }
      keyInput.remove();
      scopeSelect.remove();
      $('.keyboard-shortcut-edit').remove();
      container.removeClass('keyboard-shortcut-entry-expanded');
    }
    return this
  }

  buildShortcutRow(container: JQuery<HTMLElement>, object: any) {
    const {
      $keyboard,
      $i18n,
      editShortcut
    } = this

    var item = $('<div class="keyboard-shortcut-entry">').appendTo(container);
    container.data('data', object);

    var text = object.id.replace(/(^.+:([a-z]))|(-([a-z]))/g, function () {
      if (arguments[5] === 0) {
        return arguments[2].toUpperCase();
      } else {
        return ' ' + arguments[4].toUpperCase();
      }
    });
    var label = $('<div>').addClass('keyboard-shortcut-entry-text').text(text).appendTo(item);

    var user = $('<i class="fa fa-user"></i>').prependTo(label);

    if (!object.user) {
      user.css('opacity', 0);
    }

    var key = $('<div class="keyboard-shortcut-entry-key">').appendTo(item);
    if (object.key) {
      key.append($keyboard.formatKey(object.key));
    } else {
      item.addClass('keyboard-shortcut-entry-unassigned');
      key.append($('<span>').text($i18n.t('keyboard.unassigned')));
    }

    var scope = $('<div class="keyboard-shortcut-entry-scope">').appendTo(item);

    $('<span>').text(object.scope === '*' ? 'global' : object.scope || '').appendTo(scope);
    container.click(editShortcut);
    return this
  }

  protected get actionToKeyMap() {
    return this.keyboard.actionToKeyMap
  }

  getShortcut(actionName): object {
    return this.actionToKeyMap[actionName];
  }
}
