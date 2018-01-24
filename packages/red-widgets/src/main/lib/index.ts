/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

import {
  Context,
} from '../../common'

// import from red-runtime
import {
  Nodes,
  Actions,
  Clipboard,
  Deploy,
  Keyboard,
  Notifications,
  state,
  Subflow,
  RadialMenu,
  Utils,
} from '../../runtime'

// import widgets
import {
  Library,
  NodeDiff,
  NodeEditor,
  UserSettings,
  Tray,
  Workspaces,
  Search,
  TypeSearch,
  Sidebar,
  SidebarTabInfo,
  Palette,
  PaletteEditor,
  User,
  Canvas
} from '../..'

import * as ace from 'brace'
import marked from 'marked'

// TODO: perhaps just use generic redApi for each?
import { RedApi } from '@tecla5/red-runtime/src/api/red-api';
import { LoadNodes } from './load-nodes';
import { LoadFlows } from './load-flows';
import { MainConfiguration } from './configuration';

interface IBody extends JQuery<HTMLElement> {
  i18n: Function
}

export class Main extends Context {
  loaded: any = {}

  // TODO: perhaps just use generic redApi for each?
  protected api: RedApi

  protected loadNodesList: LoadNodes = new LoadNodes(this)
  protected loadFlowsList: LoadFlows = new LoadFlows(this)
  protected configuration: MainConfiguration = new MainConfiguration(this)

  constructor() {
    super();
    this.configure()
  }

  configure() {
    this.configuration.configure()
  }

  // /**
  //  * Load nodes list
  //  */
  loadNode() {
    this.loadNodesList.loadNodes()
  }

  // /**
  //  * Load nodes list
  //  */
  loadFlows() {
    this.loadFlowsList.loadFlows()
  }

  showAbout() {
    this.loadAbout().then(() => {
      //TO DO
    })
  }

  async loadAbout() {
    return await this.api.load({
      url: 'red/about'
    })
  }

  onLoadAboutSuccess(data) {
    const { RED } = this
    var aboutHeader = '<div style="text-align:center;">' +
      '<img width="50px" src="red/images/node-red-icon.svg" />' +
      '</div>';

    RED.sidebar.info.set(aboutHeader + marked(data));
    RED.sidebar.info.show();
  }

  loadEditor() {
    const {
    RED,
      showAbout
  } = this.rebind([
        'showAbout'
      ])

    var menuOptions = [];
    menuOptions.push({
      id: 'menu-item-view-menu',
      label: RED._('menu.label.view.view'),
      options: [
        // {id:'menu-item-view-show-grid',setting:'view-show-grid',label:RED._('menu.label.view.showGrid'),toggle:true,onselect:'core:toggle-show-grid'},
        // {id:'menu-item-view-snap-grid',setting:'view-snap-grid',label:RED._('menu.label.view.snapGrid'),toggle:true,onselect:'core:toggle-snap-grid'},
        // {id:'menu-item-status',setting:'node-show-status',label:RED._('menu.label.displayStatus'),toggle:true,onselect:'core:toggle-status', selected: true},
        //null,
        // {id:'menu-item-bidi',label:RED._('menu.label.view.textDir'),options:[
        //     {id:'menu-item-bidi-default',toggle:'text-direction',label:RED._('menu.label.view.defaultDir'),selected: true, onselect:function(s) { if(s){RED.text.bidi.setTextDirection('')}}},
        //     {id:'menu-item-bidi-ltr',toggle:'text-direction',label:RED._('menu.label.view.ltr'), onselect:function(s) { if(s){RED.text.bidi.setTextDirection('ltr')}}},
        //     {id:'menu-item-bidi-rtl',toggle:'text-direction',label:RED._('menu.label.view.rtl'), onselect:function(s) { if(s){RED.text.bidi.setTextDirection('rtl')}}},
        //     {id:'menu-item-bidi-auto',toggle:'text-direction',label:RED._('menu.label.view.auto'), onselect:function(s) { if(s){RED.text.bidi.setTextDirection('auto')}}}
        // ]},
        // null,
        {
          id: 'menu-item-sidebar',
          label: RED._('menu.label.sidebar.show'),
          toggle: true,
          onselect: 'core:toggle-sidebar',
          selected: true
        },
        null
      ]
    });
    menuOptions.push(null);
    menuOptions.push({
      id: 'menu-item-import',
      label: RED._('menu.label.import'),
      options: [{
        id: 'menu-item-import-clipboard',
        label: RED._('menu.label.clipboard'),
        onselect: 'core:show-import-dialog'
      },
      {
        id: 'menu-item-import-library',
        label: RED._('menu.label.library'),
        options: []
      }
      ]
    });
    menuOptions.push({
      id: 'menu-item-export',
      label: RED._('menu.label.export'),
      disabled: true,
      options: [{
        id: 'menu-item-export-clipboard',
        label: RED._('menu.label.clipboard'),
        disabled: true,
        onselect: 'core:show-export-dialog'
      },
      {
        id: 'menu-item-export-library',
        label: RED._('menu.label.library'),
        disabled: true,
        onselect: 'core:library-export'
      }
      ]
    });
    menuOptions.push(null);
    menuOptions.push({
      id: 'menu-item-search',
      label: RED._('menu.label.search'),
      onselect: 'core:search'
    });
    menuOptions.push(null);
    menuOptions.push({
      id: 'menu-item-config-nodes',
      label: RED._('menu.label.displayConfig'),
      onselect: 'core:show-config-tab'
    });
    menuOptions.push({
      id: 'menu-item-workspace',
      label: RED._('menu.label.flows'),
      options: [{
        id: 'menu-item-workspace-add',
        label: RED._('menu.label.add'),
        onselect: 'core:add-flow'
      },
      {
        id: 'menu-item-workspace-edit',
        label: RED._('menu.label.rename'),
        onselect: 'core:edit-flow'
      },
      {
        id: 'menu-item-workspace-delete',
        label: RED._('menu.label.delete'),
        onselect: 'core:remove-flow'
      }
      ]
    });
    menuOptions.push({
      id: 'menu-item-subflow',
      label: RED._('menu.label.subflows'),
      options: [{
        id: 'menu-item-subflow-create',
        label: RED._('menu.label.createSubflow'),
        onselect: 'core:create-subflow'
      },
      {
        id: 'menu-item-subflow-convert',
        label: RED._('menu.label.selectionToSubflow'),
        disabled: true,
        onselect: 'core:convert-to-subflow'
      },
      ]
    });
    menuOptions.push(null);

    if (RED.settings.theme('palette.editable') !== false) {
      menuOptions.push({
        id: 'menu-item-edit-palette',
        label: RED._('menu.label.editPalette'),
        onselect: 'core:manage-palette'
      });
      menuOptions.push(null);
    }

    menuOptions.push({
      id: 'menu-item-user-settings',
      label: RED._('menu.label.settings'),
      onselect: 'core:show-user-settings'
    });
    menuOptions.push(null);

    menuOptions.push({
      id: 'menu-item-keyboard-shortcuts',
      label: RED._('menu.label.keyboardShortcuts'),
      onselect: 'core:show-help'
    });
    menuOptions.push({
      id: 'menu-item-help',
      label: RED.settings.theme('menu.menu-item-help.label', RED._('menu.label.help')),
      href: RED.settings.theme('menu.menu-item-help.url', 'http://nodered.org/docs')
    });
    menuOptions.push({
      id: 'menu-item-node-red-version',
      label: 'v' + RED.settings.version,
      onselect: 'core:show-about'
    });

    RED.actions = new Actions()
    RED.clipboard = new Clipboard()

    const deployCtx = RED.settings.theme('deployButton', null)
    RED.deploy = new Deploy(deployCtx)
    RED.diff = new NodeDiff()
    RED.editor = new NodeEditor()
    RED.keyboard = new Keyboard()
    RED.library = new Library()
    RED.notifications = new Notifications()
    RED.search = new Search()
    RED.subflow = new Subflow()
    RED.tray = new Tray()
    RED.typeSearch = new TypeSearch()
    RED.userSettings = new UserSettings()
    RED.utils = new Utils()
    RED.workspaces = new Workspaces()
    RED.sidebar = new Sidebar()
    RED.palette = new Palette()

    // see above or legacy/main
    if (RED.settings.theme('palette.editable') !== false) {
      RED.palette.editor = new PaletteEditor()
    }

    RED.touch = {
      radialMenu: new RadialMenu(RED)
    }
    RED.nodes = new Nodes()
    RED.view = new Canvas()
    RED.user = new User()
    RED.library = new Library()
    RED.keyboard = new Keyboard()
    RED.palette = new Palette()

    if (RED.settings.theme('palette.editable') !== false) {
      RED.palette.editor = new PaletteEditor();
    }

    RED.sidebar = new Sidebar();

    // ================================================
    // TODO: Extract from original node-red project!!!
    // ================================================
    // RED.subflow.init();

    RED.workspaces = new Workspaces()
    RED.clipboard = new Clipboard()
    RED.search = new Search()
    RED.editor = new NodeEditor()
    RED.diff = new NodeDiff()

    RED.menu = new Menu({
      id: 'btn-sidemenu',
      options: menuOptions
    });

    RED.deploy = new Deploy(RED.settings.theme('deployButton', null));

    RED.actions.add('core:show-about', showAbout);
    RED.nodes = new Nodes()
    RED.comms.connect();

    $('#main-container').show();
    $('.header-toolbar').show();

    this.loadNodesList.loadNodeList();

    let { loaded } = this.loaded
    loaded.editor = {
      time: new Date()
    }
  }

  resetLoaded() {
    let { loaded } = this.loaded
    loaded = {}
  }
}
