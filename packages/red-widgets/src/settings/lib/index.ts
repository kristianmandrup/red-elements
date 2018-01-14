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

const allSettings = {};

import {
  Context
} from '../../common'

const {
  log
} = console

export class UserSettings extends Context {
  allSettings: any;
  settingsVisible: any;
  trayWidth: any;
  panes: any;
  constructor() {
    super()
    let viewSettings: any = this.viewSettings

    this.allSettings = {}
    let allSettings = this.allSettings
    let {
      show,
      createViewPane
    } = this.rebind([
        'show',
        'createViewPane'
      ])

    var trayWidth = 700;
    var settingsVisible = false;
    var panes = [];

    // Set instance variables
    // TODO: reuse this mechanism in other widgets
    this.setInstanceVars({
      trayWidth,
      settingsVisible,
      panes
    })

    if (!this.RED.actions) {
      this.handleError('UserSettings: missing actions', this.RED);
    }

    this.RED.actions.add("core:show-user-settings", show);
    this.RED.actions.add("core:show-help", () => {
      show('keyboard')
    });

    this.addPane({
      id: 'view',
      title: this.RED._("menu.label.view.view"),
      get: createViewPane,
      close: () => {
        viewSettings.forEach((section) => {
          section.options.forEach((opt) => {
            var input = $("#user-settings-" + opt.setting);
            if (opt.toggle) {
              this.setSelected(opt.setting, input.prop('checked'));
            } else {
              this.setSelected(opt.setting, input.val());
            }
          });
        })
      }
    })

    viewSettings.forEach((section) => {
      section.options.forEach((opt) => {
        if (opt.oldSetting) {
          var oldValue = this.RED.settings.get(opt.oldSetting);
          if (oldValue !== undefined && oldValue !== null) {
            this.RED.settings.set(opt.setting, oldValue);
            this.RED.settings.remove(opt.oldSetting);
          }
        }
        allSettings[opt.setting] = opt;
        if (opt.onchange) {
          var value = this.RED.settings.get(opt.setting);
          if (value === null && opt.hasOwnProperty('default')) {
            value = opt.default;
            this.RED.settings.set(opt.setting, value);
          }

          var callback = opt.onchange;
          if (typeof callback === 'string') {
            callback = this.RED.actions.get(callback);
          }
          if (typeof callback === 'function') {
            callback.call(opt, value);
          }
        }
      });
    });
  }


  get viewSettings() {
    const {
      RED
    } = this
    return [{
      title: "menu.label.view.grid",
      options: [{
        setting: "view-show-grid",
        oldSetting: "menu-menu-item-view-show-grid",
        label: "menu.label.view.showGrid",
        toggle: true,
        onchange: "core:toggle-show-grid"
      },
      {
        setting: "view-snap-grid",
        oldSetting: "menu-menu-item-view-snap-grid",
        label: "menu.label.view.snapGrid",
        toggle: true,
        onchange: "core:toggle-snap-grid"
      },
      {
        setting: "view-grid-size",
        label: "menu.label.view.gridSize",
        type: "number",
        default: 20,
        onchange: RED.view.gridSize
      }
      ]
    },
    {
      title: "menu.label.nodes",
      options: [{
        setting: "view-node-status",
        oldSetting: "menu-menu-item-status",
        label: "menu.label.displayStatus",
        default: true,
        toggle: true,
        onchange: "core:toggle-status"
      }]
    },
    {
      title: "menu.label.other",
      options: [{
        setting: "view-show-tips",
        oldSettings: "menu-menu-item-show-tips",
        label: "menu.label.showTips",
        toggle: true,
        default: true,
        onchange: "core:toggle-show-tips"
      }]
    }
    ];
  }

  addPane(options) {
    this.panes.push(options);
  }

  show(initialTab) {
    let {
      RED,
      settingsVisible,
      trayWidth,
    } = this

    if (this.settingsVisible) {
      return this
    }
    this.settingsVisible = true;
    var tabContainer;

    var trayOptions: any = {
      title: RED._("menu.label.userSettings"),
      buttons: [{
        id: "node-dialog-ok",
        text: RED._("common.label.close"),
        class: "primary",
        click: function () {
          RED.tray.close();
        }
      }],
      resize: (dimensions) => {
        trayWidth = dimensions.width;
      },
      open: (tray) => {
        var trayBody = tray.find('.editor-tray-body');
        var settingsContent: any = $('<div></div>').appendTo(trayBody);
        var tabContainer = $('<div></div>', {
          id: "user-settings-tabs-container"
        }).appendTo(settingsContent);

        $('<ul></ul>', {
          id: "user-settings-tabs"
        }).appendTo(tabContainer);
        var settingsTabs = RED.tabs.create({
          id: "user-settings-tabs",
          vertical: true,
          onchange: (tab) => {
            setTimeout(() => {
              $("#user-settings-tabs-content").children().hide();
              $("#" + tab.id).show();
              if (tab.pane.focus) {
                tab.pane.focus();
              }
            }, 50);
          }
        });
        var tabContents = $('<div></div>', {
          id: "user-settings-tabs-content"
        }).appendTo(settingsContent);

        this.panes.forEach((pane) => {
          settingsTabs.addTab({
            id: "user-settings-tab-" + pane.id,
            label: pane.title,
            pane: pane
          });
          pane.get().hide().appendTo(tabContents);
        });
        settingsContent.i18n();
        settingsTabs.activateTab("user-settings-tab-" + (initialTab || 'view'))
        $("#sidebar-shade").show();
      },
      close: () => {
        settingsVisible = false;
        this.panes.forEach((pane) => {
          if (pane.close) {
            pane.close();
          }
        });
        $("#sidebar-shade").hide();

      },
      show: () => { }
    }
    if (trayWidth !== null) {
      trayOptions.width = trayWidth;
    }
    RED.tray.show(trayOptions);
  }

  createViewPane() {
    const {
      viewSettings,
      RED
    } = this

    var pane = $('<div id="user-settings-tab-view" class="node-help"></div>');

    viewSettings.forEach(function (section: any) {
      $('<h3></h3>').text(RED._(section.title)).appendTo(pane);
      section.options.forEach(function (opt) {
        var initialState = RED.settings.get(opt.setting);
        var row = $('<div class="user-settings-row"></div>').appendTo(pane);
        var input;
        if (opt.toggle) {
          input = $('<label for="user-settings-' + opt.setting + '"><input id="user-settings-' + opt.setting + '" type="checkbox"> ' + RED._(opt.label) + '</label>').appendTo(row).find("input");
          input.prop('checked', initialState);
        } else {
          $('<label for="user-settings-' + opt.setting + '">' + RED._(opt.label) + '</label>').appendTo(row);
          $('<input id="user-settings-' + opt.setting + '" type="' + (opt.type || "text") + '">').appendTo(row).val(initialState);
        }
      });
    })
    return pane;
  }

  setSelected(id, value) {
    const {
      RED,
      allSettings
    } = this
    var opt = allSettings[id];
    if (!opt) {
      this.handleError(`setSelected: No setting for ${id}`, {
        allSettings,
        id
      })
    }

    RED.settings.set(opt.setting, value);
    var callback = opt.onchange;
    if (typeof callback === 'string') {
      callback = RED.actions.get(callback);
    }
    if (typeof callback === 'function') {
      callback.call(opt, value);
    }
  }

  toggle(id) {
    const {
      RED,
      allSettings
    } = this
    var opt = allSettings[id];
    if (!opt) {
      this.handleError(`toggle: No setting for ${id}`, {
        allSettings,
        id
      })
    }
    var state = RED.settings.get(opt.setting);
    this.setSelected(id, !state);
  }
}
