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

import {
  Communications,
  Events,
  I18n,
  Settings,
  History,
  Nodes,
} from '@tecla5/red-runtime/src'

import {
  TextFormat,
  Bidi,
  Main,
  User,
  Validators,
  Actions,
  Clipboard,
  Canvas,
  Deploy,
  NodeDiff,
  NodeEditor,
  Keyboard,
  Library,
  Notifications,
  Search,
  // Subflow, // TODO: Extract from original node-red project
  Tray,
  TypeSearch,
  UserSettings,
  Utils,
  Workspaces,
  Sidebar,
  SidebarTabConfig,
  SidebarTabInfo,
  Palette,
  PaletteEditor,
  RadialMenu
} from '../'

var RED: any = {};
RED.text = {
  bidi: new Bidi(),
  format: new TextFormat()
}
RED.history = new History()
RED.nodes = new Nodes()

// See legacy/main.js
RED.view = new Canvas()
RED.user = new User()

RED.library = new Library()
RED.keyboard = new Keyboard()
RED.palette = new Palette()
if (RED.settings.theme('palette.editable') !== false) {
  RED.palette.editor = new PaletteEditor();
}

RED.sidebar = new Sidebar();
// RED.subflow.init();
RED.workspaces = new Workspaces()
RED.clipboard = new Clipboard()
RED.search = new Search()
RED.editor = new NodeEditor()
RED.diff = new NodeDiff()

// RED.menu.init({id:"btn-sidemenu",options: menuOptions});
// RED.deploy.init(RED.settings.theme("deployButton",null));
// RED.actions.add("core:show-about", showAbout);

RED.nodes = new Nodes();
RED.comms = new Communications().connect()

RED.i18n = new I18n()
RED.events = new Events()
RED.settings = new Settings()
RED.validators = new Validators()

// NOTE: All wired up inside main.loadEditor()
// // TODO: All UI editor wiring should be done in ui/main loadEditor() method

RED.actions = new Actions()
RED.clipboard = new Clipboard()
const deployCtx = RED.settings.theme('deployButton', null)
RED.deploy = new Deploy(deployCtx)
RED.editor = new NodeEditor()
RED.keyboard = new Keyboard()
RED.library = new Library()
RED.notifications = new Notifications()
RED.search = new Search()
// RED.subflow = new Subflow()
RED.tray = new Tray()
RED.typeSearch = new TypeSearch()
RED.userSettings = new UserSettings()
RED.utils = new Utils()
RED.workspaces = new Workspaces()
RED.sidebar = new Sidebar()

// // NOTE: created within sidebar constructor
RED.sidebar.config = new SidebarTabConfig()
RED.sidebar.info = new SidebarTabInfo()

RED.palette = new Palette()

// // see above or legacy/main
if (RED.settings.theme('palette.editable') !== false) {
  RED.palette.editor = new PaletteEditor()
}

RED.touch = {
  radialMenu: new RadialMenu()
}

export default RED
