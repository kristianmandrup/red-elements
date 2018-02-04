import { UserSettings } from './';
import { Context } from '../../context';
import { UserSettingsDisplay } from './display';

import {
  delegator,
  delegateTarget,
  container,
  lazyInject,
  $TYPES
} from './container'

import {
  IActions,
  ICanvas,

} from '../../_interfaces'

import { ISettings } from '@tecla5/red-runtime'
import { II18n } from '../../../../red-runtime/src/i18n/index';
import { IUserSettings } from '../index';

const TYPES = $TYPES.all

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

@delegateTarget()
@delegator({
  map: {
    display: UserSettingsDisplay
  }
})
export class UserSettingsConfiguration extends Context {

  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.canvas) $view: ICanvas
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.i18n) $i18n: II18n

  allSettings = {}
  trayWidth = 700;
  settingsVisible = false;
  panes = [];

  protected display: UserSettingsDisplay //= new UserSettingsDisplay(this.settings, this)

  constructor(public settings: IUserSettings) {
    super()
  }

  configure() {
    const {
      rebind,

      $settings,
      $actions,
      $i18n
  } = this

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
    } = rebind([
        'show',
        'createViewPane',
        'handleError',
        'setInstanceVars',
        'addPane',
        'setSelected'
      ], $settings)

    if (!actions) {
      handleError('UserSettings: missing actions', {
        $settings
      });
    }

    $actions.add("core:show-user-settings", show);
    $actions.add("core:show-help", () => {
      show('keyboard')
    });

    display.addPane({
      id: 'view',
      title: $i18n.t("menu.label.view.view"),
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
          var oldValue = $settings.get(opt.oldSetting);
          if (oldValue !== undefined && oldValue !== null) {
            $settings.set(opt.setting, oldValue);
            $settings.remove(opt.oldSetting);
          }
        }
        allSettings[opt.setting] = opt;
        if (opt.onchange) {
          var value = $settings.get(opt.setting);
          if (value === null && opt.hasOwnProperty('default')) {
            value = opt.default;
            $settings.set(opt.setting, value);
          }

          var callback = opt.onchange;
          if (typeof callback === 'string') {
            callback = $actions.get(callback);
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
      $view
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
        onchange: $view.gridSize
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

