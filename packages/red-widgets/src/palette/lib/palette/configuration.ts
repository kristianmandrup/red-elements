import { PaletteEditor } from './';

import {
  Context, $, EditableList, Searchbox,
  container,
  delegateTarget
} from './_base'

import {
  lazyInject,
  $TYPES
} from '../../../_container'

import {
  I18n,
  IUserSetting,
  IActions,
  IEvents,
  INodes
} from '../../../_interfaces'

const TYPES = $TYPES.all

@delegateTarget()
export class PaletteConfiguration extends Context {

  @lazyInject(TYPES.userSettings) userSettings: IUserSetting;
  @lazyInject(TYPES.actions) actions: IActions
  @lazyInject(TYPES.events) events: IEvents
  @lazyInject(TYPES.nodes) nodes: INodes

  constructor(public editor: PaletteEditor) {
    super()
  }

  configure() {
    const {
      RED,
      userSettings,
      actions,
      events,
      nodes
    } = this

    // make jquery Widget factories available for jQuery elements
    new Searchbox()
    new EditableList()

    if (RED.settings.theme('palette.editable') === false) {
      return;
    }
    let {
      createSettingsPane,
      getSettingsPane
    } = this.rebind([
        'createSettingsPane',
        'getSettingsPane'
      ])

    let {
      settingsPane,
      editorTabs,
      filterInput,
      filteredList,
      refreshNodeModule,
      nodeEntries,
      nodeList,
      typesInUse,
    } = this.rebind([
        'refreshNodeModule',
      ])

    createSettingsPane();

    userSettings.add({
      id: 'palette',
      title: RED._("palette.editor.palette"),
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

    actions.add("core:manage-palette", function () {
      userSettings.show('palette');
    });

    events.on('registry:module-updated', function (ns) {
      refreshNodeModule(ns.module);
    });
    events.on('registry:node-set-enabled', function (ns) {
      refreshNodeModule(ns.module);
    });
    events.on('registry:node-set-disabled', function (ns) {
      refreshNodeModule(ns.module);
    });
    events.on('registry:node-type-added', function (nodeType) {
      if (!/^subflow:/.test(nodeType)) {
        var ns = nodes.registry.getNodeSetForType(nodeType);
        refreshNodeModule(ns.module);
      }
    });
    events.on('registry:node-type-removed', function (nodeType) {
      if (!/^subflow:/.test(nodeType)) {
        var ns = nodes.registry.getNodeSetForType(nodeType);
        refreshNodeModule(ns.module);
      }
    });
    events.on('registry:node-set-added', function (ns) {
      refreshNodeModule(ns.module);
      for (var i = 0; i < filteredList.length; i++) {
        if (filteredList[i].info.id === ns.module) {
          var installButton = filteredList[i].elements.installButton;
          installButton.addClass('disabled');
          installButton.html(RED._('palette.editor.installed'));
          break;
        }
      }
    });
    events.on('registry:node-set-removed', function (ns) {
      var module = nodes.registry.getModule(ns.module);
      if (!module) {
        var entry = nodeEntries[ns.module];
        if (entry) {
          nodeList.editableList('removeItem', entry);
          delete nodeEntries[ns.module];
          for (var i = 0; i < filteredList.length; i++) {
            if (filteredList[i].info.id === ns.module) {
              var installButton = filteredList[i].elements.installButton;
              installButton.removeClass('disabled');
              installButton.html(RED._('palette.editor.install'));
              break;
            }
          }
        }
      }
    });
    events.on('nodes:add', function (n) {
      if (!/^subflow:/.test(n.type)) {
        typesInUse[n.type] = (typesInUse[n.type] || 0) + 1;
        if (typesInUse[n.type] === 1) {
          var ns = nodes.registry.getNodeSetForType(n.type);
          refreshNodeModule(ns.module);
        }
      }
    })
    events.on('nodes:remove', function (n) {
      if (typesInUse.hasOwnProperty(n.type)) {
        typesInUse[n.type]--;
        if (typesInUse[n.type] === 0) {
          delete typesInUse[n.type];
          var ns = nodes.registry.getNodeSetForType(n.type);
          refreshNodeModule(ns.module);
        }
      }
    })
  }
}
