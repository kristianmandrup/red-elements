import { UserSettings } from './';
import { Context } from '../../context';
import { UserSettingsDisplay } from './display';

export interface IViewSettingOption {
  setting: string
  oldSetting?: string
  label?: string
  toggle?: boolean
  type?: string
  default?: number,
  onchange: string
}

export interface IViewSetting {
  title?: string
  options: IViewSettingOption[]
}

export class UserSettingsConfiguration extends Context {
  protected allSettings = {}

  protected display: UserSettingsDisplay = new UserSettingsDisplay(this.settings, this)

  constructor(public settings: UserSettings) {
    super()
  }

  configure() {
    const {
      RED,
    } = this.settings

    let {
      viewSettings,
      allSettings,
      display
    } = this

    let {
      show,
      createViewPane,
      handleError,
      setInstanceVars,
      addPane,
      setSelected
    } = this.rebind([
        'show',
        'createViewPane',
        'handleError',
        'setInstanceVars',
        'addPane',
        'setSelected'
      ])

    var trayWidth = 700;
    var settingsVisible = false;
    var panes = [];

    // Set instance variables
    // TODO: reuse this mechanism in other widgets
    setInstanceVars({
      trayWidth,
      settingsVisible,
      panes
    })

    if (!RED.actions) {
      handleError('UserSettings: missing actions', RED);
    }

    RED.actions.add("core:show-user-settings", show);
    RED.actions.add("core:show-help", () => {
      show('keyboard')
    });

    display.addPane({
      id: 'view',
      title: RED._("menu.label.view.view"),
      get: createViewPane,
      close: () => {
        viewSettings.forEach(function (section: IViewSetting) {
          section.options.forEach((opt) => {
            var input = $("#user-settings-" + opt.setting);
            if (opt.toggle) {
              setSelected(opt.setting, input.prop('checked'));
            } else {
              setSelected(opt.setting, input.val());
            }
          });
        })
      }
    })

    viewSettings.forEach((section) => {
      section.options.forEach(function (opt: any) {
        if (opt.oldSetting) {
          var oldValue = RED.settings.get(opt.oldSetting);
          if (oldValue !== undefined && oldValue !== null) {
            RED.settings.set(opt.setting, oldValue);
            RED.settings.remove(opt.oldSetting);
          }
        }
        allSettings[opt.setting] = opt;
        if (opt.onchange) {
          var value = RED.settings.get(opt.setting);
          if (value === null && opt.hasOwnProperty('default')) {
            value = opt.default;
            RED.settings.set(opt.setting, value);
          }

          var callback = opt.onchange;
          if (typeof callback === 'string') {
            callback = RED.actions.get(callback);
          }
          if (typeof callback === 'function') {
            callback.call(opt, value);
          }
        }
      });
    });

    this.setInstanceVars({
      viewSettings,
      allSettings
    }, this.settings)
  }

  get viewSettings(): IViewSetting[] {
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
        oldSetting: "menu-menu-item-show-tips",
        label: "menu.label.showTips",
        toggle: true,
        default: true,
        onchange: "core:toggle-show-tips"
      }]
    }
    ]
  }
}

