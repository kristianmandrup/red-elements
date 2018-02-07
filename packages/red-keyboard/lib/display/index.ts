import { IKeyboard } from '../interface';

import {
  d3,
  Context,
  delegateTarget,
  lazyInject,
  $TYPES
} from '../_base'

import {
  ISearchBox,
  IEditableList
} from '../interfaces'
import { JQElem } from '../../../_interfaces/index';
import { IActions } from '../../../actions/lib/interface';

export interface IKeyboardSettingsDisplay {
  getSettingsPane(): JQElem
}

const TYPES = $TYPES.all

@delegateTarget()
export class KeyboardSettingsDisplay extends Context implements IKeyboardSettingsDisplay {
  @lazyInject(TYPES.actions) $actions: IActions

  constructor(protected keyboard: IKeyboard) {
    super()
  }

  /**
   * display keyboard Settings Pane
   */
  getSettingsPane(): JQElem {
    const {
      $actions,
      rebind,
      keyboard
    } = this

    const {
      buildShortcutRow
  } = this.rebind([
        'buildShortcutRow'
      ], keyboard)

    var pane = $('<div id="user-settings-tab-keyboard"></div>');

    $(`<div class="keyboard-shortcut-entry keyboard-shortcut-list-header">
    <div class="keyboard-shortcut-entry-key keyboard-shortcut-entry-text">
    <input id="user-settings-tab-keyboard-filter" type="text" data-i18n="[placeholder]keyboard.filterActions"></div>
    <div class="keyboard-shortcut-entry-key" data-i18n="keyboard.shortcut"> </div>
    <div class="keyboard-shortcut-entry-scope" data-i18n="keyboard.scope"></div>
    </div>`).appendTo(pane);

    const inputPane = <ISearchBox>pane.find('input')
    inputPane.searchBox({
      delay: 100,
      change: function () {
        var filterValue = String($(this).val()).trim();
        if (filterValue === '') {
          shortcutList.editableList('filter', null);
        } else {
          filterValue = filterValue.replace(/\s/g, '');
          shortcutList.editableList('filter', function (data) {
            return data.id.toLowerCase().replace(/^.*:/, '').replace('-', '').indexOf(filterValue) > -1;
          })
        }
      }
    });

    var shortcutList = <IEditableList>$('<ol class="keyboard-shortcut-list"></ol>').css({
      position: 'absolute',
      top: '32px',
      bottom: '0',
      left: '0',
      right: '0'
    }).appendTo(pane)

    shortcutList.editableList({
      addButton: false,
      scrollOnAdd: false,
      addItem: function (container, i, object) {
        buildShortcutRow(container, object);
      },

    });
    var shortcuts = $actions.list();
    shortcuts.sort(function (A, B) {
      var Aid = A.id.replace(/^.*:/, '').replace(/[ -]/g, '').toLowerCase();
      var Bid = B.id.replace(/^.*:/, '').replace(/[ -]/g, '').toLowerCase();
      return Aid.localeCompare(Bid);
    });
    shortcuts.forEach(function (s) {
      shortcutList.editableList('addItem', s);
    });
    return pane;
  }
}
