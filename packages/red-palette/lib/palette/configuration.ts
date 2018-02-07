import { PaletteEditor } from './';

import {
  Context, $, EditableList, Searchbox,
  container,
  delegateTarget,
  delegateTo,
  delegator,
  lazyInject,
  $TYPES
} from './_base'

import {
  IUserSetting,
  IActions,
  IEvents,
  INodes,
  ISettings
} from '../../../_interfaces'

import { isTemplateMiddleOrTemplateTail } from 'typescript';
import { II18n } from '../../../../../red-runtime/src/i18n/interface';

const TYPES = $TYPES.all

export interface IPaletteConfiguration {
  configure()
}

@delegator(container)
export class PaletteConfiguration extends Context implements IPaletteConfiguration {
  @lazyInject(TYPES.userSettings) $userSettings: IUserSetting;
  @lazyInject(TYPES.actions) $actions: IActions
  @lazyInject(TYPES.events) $events: IEvents
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.settings) $settings: ISettings
  @lazyInject(TYPES.i18n) $i18n: II18n

  constructor(public editor: PaletteEditor) {
    super()
  }

  configure() {
    const {
      $userSettings,
      $actions,
      $events,
      $nodes,
      $settings,
      $i18n
    } = this

    // make jquery Widget factories available for jQuery elements
    new Searchbox()
    new EditableList()

    if ($settings.theme('palette.editable') === false) {
      return;
    }
    const {
      createSettingsPane,
      configUserSettings,
      configActions,
      configEvents
    } = this.rebind([
        'createSettingsPane',
        'configUserSettings',
        'configActions',
        'configEvents'
      ])

    const {
      settingsPane,
      editorTabs,
      filterInput,
      filteredList,
      nodeEntries,
      nodeList,
      typesInUse,
    } = this.editor

    createSettingsPane();
    configUserSettings()
    configActions()
    configEvents()
  }

  configUserSettings() {
    const {
      $userSettings,
      $i18n
    } = this
    const {
      settingsPane,
      editorTabs,
      filterInput,
    } = this.editor
    const {
      getSettingsPane,
    } = this.rebind([
        'getSettingsPane',
      ])

    $userSettings.add({
      id: 'palette',
      title: $i18n.t("palette.editor.palette"),
      get: getSettingsPane,
      close: function () {
        settingsPane.detach();
      },
      focus: function () {
        editorTabs.resize();
        setTimeout(function () {
          filterInput.focus();
        }, 200);
      }
    })
  }

  configActions() {
    const {
      $userSettings,
      $actions
    } = this

    $actions.add("core:manage-palette", function () {
      $userSettings.show('palette');
    });
  }

  configEvents() {
    const {
      $events,
      $i18n,
      $nodes
    } = this
    const {
      settingsPane,
      editorTabs,
      filterInput,
      filteredList,
      nodeEntries,
      nodeList,
      typesInUse,
    } = this.editor

    const {
      getSettingsPane,
      refreshNodeModule,
    } = this.rebind([
        'createSettingsPane',
        'getSettingsPane',
        'refreshNodeModule',
      ])

    $events.on('registry:module-updated', function (ns) {
      refreshNodeModule(ns.module);
    });
    $events.on('registry:node-set-enabled', function (ns) {
      refreshNodeModule(ns.module);
    });
    $events.on('registry:node-set-disabled', function (ns) {
      refreshNodeModule(ns.module);
    });
    $events.on('registry:node-type-added', function (nodeType) {
      if (!/^subflow:/.test(nodeType)) {
        var ns = $nodes.registry.getNodeSetForType(nodeType);
        refreshNodeModule(ns.module);
      }
    });
    $events.on('registry:node-type-removed', function (nodeType) {
      if (!/^subflow:/.test(nodeType)) {
        var ns = $nodes.registry.getNodeSetForType(nodeType);
        refreshNodeModule(ns.module);
      }
    });
    $events.on('registry:node-set-added', function (ns) {
      refreshNodeModule(ns.module);
      for (var i = 0; i < filteredList.length; i++) {
        if (filteredList[i].info.id === ns.module) {
          var installButton = filteredList[i].elements.installButton;
          installButton.addClass('disabled');
          installButton.html($i18n.t('palette.editor.installed'));
          break;
        }
      }
    });

    $events.on('registry:node-set-removed', function (ns) {
      var module = $nodes.registry.getModule(ns.module);
      if (!module) {
        var entry = nodeEntries[ns.module];
        if (entry) {
          nodeList.editableList('removeItem', entry);
          delete nodeEntries[ns.module];
          for (var i = 0; i < filteredList.length; i++) {
            if (filteredList[i].info.id === ns.module) {
              var installButton = filteredList[i].elements.installButton;
              installButton.removeClass('disabled');
              installButton.html($i18n.t('palette.editor.install'));
              break;
            }
          }
        }
      }
    });
    $events.on('nodes:add', function (n) {
      if (!/^subflow:/.test(n.type)) {
        typesInUse[n.type] = (typesInUse[n.type] || 0) + 1;
        if (typesInUse[n.type] === 1) {
          var ns = $nodes.registry.getNodeSetForType(n.type);
          refreshNodeModule(ns.module);
        }
      }
    })
    $events.on('nodes:remove', function (n) {
      if (typesInUse.hasOwnProperty(n.type)) {
        typesInUse[n.type]--;
        if (typesInUse[n.type] === 0) {
          delete typesInUse[n.type];
          var ns = $nodes.registry.getNodeSetForType(n.type);
          refreshNodeModule(ns.module);
        }
      }
    })
  }
}
