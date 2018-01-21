import { UserSettings } from './';
import { Context } from '../../context';
import { IViewSetting, UserSettingsConfiguration } from './configuration';

export class UserSettingsDisplay extends Context {
  allSettings = {}

  constructor(public settings: UserSettings, public configuration: UserSettingsConfiguration) {
    super()
  }


  get panes() {
    return this.panes
  }

  addPane(options) {
    this.panes.push(options);
  }

  get viewSettings(): IViewSetting[] {
    return this.configuration.viewSettings
  }

  createViewPane() {
    const {
      RED,
      viewSettings
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

  show(initialTab) {
    let {
    RED,
      settingsVisible,
      trayWidth,
  } = this.settings

    if (settingsVisible) {
      return this
    }
    settingsVisible = true;
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
}
