import { Keyboard, Searchbox } from '../../';

import {
  d3,
  Context,
  delegateTarget
} from './_base'

const isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
const isIOS = navigator.platform.match(/(iPhone|iPod|iPad)/i) ? true : false;
const isMac = /Mac/i.test(window.navigator.platform);

const cmdCtrlKey = '<span class="help-key">' + (isMacLike ? '&#8984;' : 'Ctrl') + '</span>';

const keyMap = {
  "left": 37,
  "up": 38,
  "right": 39,
  "down": 40,
  "escape": 27,
  "enter": 13,
  "backspace": 8,
  "delete": 46,
  "space": 32,
  ";": 186,
  "=": 187,
  ",": 188,
  "-": 189,
  ".": 190,
  "/": 191,
  "\\": 220,
  "'": 222,
  "?": 191 // <- QWERTY specific
}
const metaKeyCodes = {
  16: true,
  17: true,
  18: true,
  91: true,
  93: true
}

interface IActionKeyMap {
  scope?: object,
  key?: string,
  user?: object
}

interface I18n extends JQuery<HTMLElement> {
  i18n: Function
}

interface ISearchBox extends JQuery<HTMLElement> {
  searchBox: Function
}

interface IEditableList extends JQuery<HTMLElement> {
  editableList: Function
}

const firefoxKeyCodeMap = {
  59: 186,
  61: 187,
  173: 189
}

export interface IKeyboardConfiguration {
  configure()
  revertToDefault(action: string)
  parseKeySpecifier(key: string)
  resolveKeyEvent(evt)
  addHandler(scope: any, key: string, modifiers: Function | string, ondown: Function | string)
  removeHandler(key: string, modifiers: any)
  formatKey(key: string): string
  validateKey(key: string): boolean
  editShortcut(e, container?)
  endEditShortcut(cancel: boolean)
  buildShortcutRow(container: JQuery<HTMLElement>, object: any)
  getSettingsPane(): JQuery<HTMLElement>
  getShortcut(actionName: string): object
}

@delegateTarget()
export class KeyboardConfiguration extends Context implements IKeyboardConfiguration {
  disabled: boolean

  public handlers = {};
  public partialState = null;
  public actionToKeyMap: IActionKeyMap = {}
  public defaultKeyMap = {};

  constructor(protected keyboard: Keyboard) {
    super()
  }

  configure() {
    // TODO:
    // somehow use SearchBox widget from red-widgets (possibly move all common widgets to red-runtime)
    // avoid circular dependency!

    // make Searchbox widget factory available on all jQuery elements
    new Searchbox()

    const {
          ctx,
      defaultKeyMap,
      actionToKeyMap,
        } = this
    const {
          getSettingsPane,
      resolveKeyEvent,
      addHandler
        } = this.rebind([
        'getSettingsPane',
        'resolveKeyEvent',
        'addHandler'
      ])

    var userKeymap = ctx.settings.get('keymap') || {};
    $.getJSON("red/keymap.json", function (data) {
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

    ctx.userSettings.add({
      id: 'keyboard',
      title: ctx._("keyboard.keyboard"),
      get: getSettingsPane,
      focus: function () {
        setTimeout(function () {
          $("#user-settings-tab-keyboard-filter").focus();
        }, 200);
      }
    })

    const $window = d3.select(window)
    $window.on("keydown", function () {
      if (metaKeyCodes[d3.event.keyCode]) {
        return;
      }
      var handler = resolveKeyEvent(d3.event);
      if (handler && handler.ondown) {
        if (typeof handler.ondown === "string") {
          ctx.actions.invoke(handler.ondown);
        } else {
          handler.ondown();
        }
        d3.event.preventDefault();
      }
    });

  }

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

  parseKeySpecifier(key: string) {
    this._validateStr(key, 'key', 'parseKeySpecifier')

    var parts = key.toLowerCase().split("-");
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
        case "ctrl":
        case "cmd":
          modifiers.ctrl = true;
          modifiers.meta = true;
          break;
        case "alt":
          modifiers.alt = true;
          break;
        case "shift":
          modifiers.shift = true;
          break;
        case "":
          blank++;
          keycode = keyMap["-"];
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
      } else if (handler.scope && handler.scope !== "*") {
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
    if (typeof modifiers == "function" || typeof modifiers === "string") {
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

      var parts = key.split(" ");
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

      var parts = key.split(" ");
      for (i = 0; i < parts.length; i++) {
        var parsedKey = parseKeySpecifier(parts[i]);
        if (parsedKey) {
          keys.push(parsedKey);
        } else {
          this.logWarning("Unrecognised key specifier:", {
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
    if (typeof slot.ondown === "string") {
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

  formatKey(key: string): string {
    var formattedKey = isMac ? key.replace(/ctrl-?/, "&#8984;") : key;
    formattedKey = isMac ? formattedKey.replace(/alt-?/, "&#8997;") : key;
    formattedKey = formattedKey.replace(/shift-?/, "&#8679;")
    formattedKey = formattedKey.replace(/left/, "&#x2190;")
    formattedKey = formattedKey.replace(/up/, "&#x2191;")
    formattedKey = formattedKey.replace(/right/, "&#x2192;")
    formattedKey = formattedKey.replace(/down/, "&#x2193;")
    return '<span class="help-key-block"><span class="help-key">' + formattedKey.split(" ").join('</span> <span class="help-key">') + '</span></span>';
  }

  validateKey(key: string): boolean {
    const {
      parseKeySpecifier
    } = this.rebind([
        'parseKeySpecifier'
      ])

    key = key.trim();
    var parts = key.split(" ");
    for (var i = 0; i < parts.length; i++) {
      var parsedKey = parseKeySpecifier(parts[i]);
      if (!parsedKey) {
        return false;
      }
    }
    return true;
  }

  editShortcut(e, container?) {
    const {
      ctx,
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

      var key = container.find(".keyboard-shortcut-entry-key");
      var scope = container.find(".keyboard-shortcut-entry-scope");
      container.addClass('keyboard-shortcut-entry-expanded');

      var keyInput = $('<input type="text">').attr('placeholder', ctx._('keyboard.unassigned')).val(object.key || "").appendTo(key);
      keyInput.on("keyup", function (e) {
        if (e.keyCode === 13) {
          return endEditShortcut();
        }
        var currentVal = String($(this).val());
        currentVal = currentVal.trim();
        var valid = (currentVal === "" || ctx.keyboard.validateKey(currentVal));
        $(this).toggleClass("input-error", !valid);
      })

      var scopeSelect = <I18n>$('<select><option value="*" data-i18n="keyboard.global"></option><option value="workspace" data-i18n="keyboard.workspace"></option></select>').appendTo(scope);
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
        ctx.keyboard.revertToDefault(object.id);
        container.empty();
        container.removeClass('keyboard-shortcut-entry-expanded');
        var shortcut = ctx.keyboard.getShortcut(object.id);
        var userKeymap = ctx.settings.get('keymap') || {};
        delete userKeymap[object.id];
        ctx.settings.set('keymap', userKeymap);

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

  endEditShortcut(cancel: boolean) {
    const {
      ctx
    } = this

    var container = $('.keyboard-shortcut-entry-expanded');
    if (container.length === 1) {
      var object = container.data('data');
      var keyInput = container.find(".keyboard-shortcut-entry-key input");
      var scopeSelect = container.find(".keyboard-shortcut-entry-scope select");
      if (!cancel) {
        var key = String(keyInput.val()).trim();
        var scope = String(scopeSelect.val());
        var valid = (key === "" || ctx.keyboard.validateKey(key));
        if (valid) {
          var current = ctx.keyboard.getShortcut(object.id);
          if ((!current && key) || (current && (current.scope !== scope || current.key !== key))) {
            var keyDiv = container.find(".keyboard-shortcut-entry-key");
            var scopeDiv = container.find(".keyboard-shortcut-entry-scope");
            keyDiv.empty();
            scopeDiv.empty();
            if (object.key) {
              ctx.keyboard.remove(object.key, true);
            }
            container.find(".keyboard-shortcut-entry-text i").css("opacity", 1);
            if (key === "") {
              keyDiv.parent().addClass("keyboard-shortcut-entry-unassigned");
              keyDiv.append($('<span>').text(ctx._('keyboard.unassigned')));
              delete object.key;
              delete object.scope;
            } else {
              keyDiv.parent().removeClass("keyboard-shortcut-entry-unassigned");
              keyDiv.append(ctx.keyboard.formatKey(key))
              $("<span>").text(scope).appendTo(scopeDiv);
              object.key = key;
              object.scope = scope;
              ctx.keyboard.add(object.scope, object.key, object.id, true);
            }
            var userKeymap = ctx.settings.get('keymap') || {};
            userKeymap[object.id] = ctx.keyboard.getShortcut(object.id);
            ctx.settings.set('keymap', userKeymap);
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
      ctx,
      editShortcut
    } = this

    var item = $('<div class="keyboard-shortcut-entry">').appendTo(container);
    container.data('data', object);

    var text = object.id.replace(/(^.+:([a-z]))|(-([a-z]))/g, function () {
      if (arguments[5] === 0) {
        return arguments[2].toUpperCase();
      } else {
        return " " + arguments[4].toUpperCase();
      }
    });
    var label = $('<div>').addClass("keyboard-shortcut-entry-text").text(text).appendTo(item);

    var user = $('<i class="fa fa-user"></i>').prependTo(label);

    if (!object.user) {
      user.css("opacity", 0);
    }

    var key = $('<div class="keyboard-shortcut-entry-key">').appendTo(item);
    if (object.key) {
      key.append(ctx.keyboard.formatKey(object.key));
    } else {
      item.addClass("keyboard-shortcut-entry-unassigned");
      key.append($('<span>').text(ctx._('keyboard.unassigned')));
    }

    var scope = $('<div class="keyboard-shortcut-entry-scope">').appendTo(item);

    $("<span>").text(object.scope === '*' ? 'global' : object.scope || "").appendTo(scope);
    container.click(editShortcut);
    return this
  }

  getSettingsPane(): JQuery<HTMLElement> {
    const {
      ctx,
      buildShortcutRow
    } = this.rebind([
        'buildShortcutRow'
      ])
    var pane = $('<div id="user-settings-tab-keyboard"></div>');

    $('<div class="keyboard-shortcut-entry keyboard-shortcut-list-header">' +
      '<div class="keyboard-shortcut-entry-key keyboard-shortcut-entry-text"><input id="user-settings-tab-keyboard-filter" type="text" data-i18n="[placeholder]keyboard.filterActions"></div>' +
      '<div class="keyboard-shortcut-entry-key" data-i18n="keyboard.shortcut"></div>' +
      '<div class="keyboard-shortcut-entry-scope" data-i18n="keyboard.scope"></div>' +
      '</div>').appendTo(pane);

    const inputPane = <ISearchBox>pane.find("input")
    inputPane.searchBox({
      delay: 100,
      change: function () {
        var filterValue = String($(this).val()).trim();
        if (filterValue === "") {
          shortcutList.editableList('filter', null);
        } else {
          filterValue = filterValue.replace(/\s/g, "");
          shortcutList.editableList('filter', function (data) {
            return data.id.toLowerCase().replace(/^.*:/, "").replace("-", "").indexOf(filterValue) > -1;
          })
        }
      }
    });

    var shortcutList = <IEditableList>$('<ol class="keyboard-shortcut-list"></ol>').css({
      position: "absolute",
      top: "32px",
      bottom: "0",
      left: "0",
      right: "0"
    }).appendTo(pane)

    shortcutList.editableList({
      addButton: false,
      scrollOnAdd: false,
      addItem: function (container, i, object) {
        buildShortcutRow(container, object);
      },

    });
    var shortcuts = ctx.actions.list();
    shortcuts.sort(function (A, B) {
      var Aid = A.id.replace(/^.*:/, "").replace(/[ -]/g, "").toLowerCase();
      var Bid = B.id.replace(/^.*:/, "").replace(/[ -]/g, "").toLowerCase();
      return Aid.localeCompare(Bid);
    });
    shortcuts.forEach(function (s) {
      shortcutList.editableList('addItem', s);
    });
    return pane;
  }

  getShortcut(actionName): object {
    return this.actionToKeyMap[actionName];
  }
}
