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
  Context
} from '../../context'

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
  Editor,
  UserSettings,
  Tray,
  Workspaces,
  Search,
  TypeSearch,
  Sidebar,
  SidebarTabConfig,
  SidebarTabInfo,
  Palette,
  PaletteEditor
} from '../..'

import * as ace from 'brace'
import marked from 'marked'

interface IBody extends JQuery<HTMLElement> {
  i18n: Function
}

export class Main extends Context {
  loaded: any = {}

  constructor() {
    super();

    const {
      RED,
      loadEditor
    } = this.rebind([
        'loadEditor'
      ])

    $(() => {

      if ((window.location.hostname !== "localhost") && (window.location.hostname !== "127.0.0.1")) {
        document.title = document.title + " : " + window.location.hostname;
      }

      // Fix: using normal require: https://github.com/thlorenz/brace/tree/master/ext
      // ace.require
      require('brace/ext/language_tools');

      RED.i18n.init(function () {
        RED.settings.init(loadEditor);
      })
    });
  }

  loadNodeList() {
    const { RED, loadNodes } = this
    $.ajax({
      headers: {
        "Accept": "application/json"
      },
      cache: false,
      url: 'nodes',
      success: (data) => {
        RED.nodes.setNodeList(data);
        RED.i18n.loadNodeCatalogs(loadNodes);
        this.loaded.nodeList = {
          time: new Date()
        }
      }
    });
  }

  loadNodes() {
    const RED = this.RED;
    $.ajax({
      headers: {
        "Accept": "text/html"
      },
      cache: false,
      url: 'nodes',
      success: (data) => {
        let body = <IBody>$("body").append(data);
        body.i18n();
        $("#palette > .palette-spinner").hide();
        $(".palette-scroll").removeClass("hide");
        $("#palette-search").removeClass("hide");
        this.loadFlows();
        this.loaded.nodes = {
          time: new Date()
        }
      }
    });
  }

  loadFlows() {
    const {
      RED
    } = this
    const { nodes } = RED

    $.ajax({
      headers: {
        "Accept": "application/json",
      },
      cache: false,
      url: 'flows',
      success: (nodes) => {
        var currentHash = window.location.hash;
        nodes.version(nodes.rev);
        nodes.import(nodes.flows);
        nodes.dirty(false);
        RED.view.redraw(true);
        if (/^#flow\/.+$/.test(currentHash)) {
          RED.workspaces.show(currentHash.substring(6));
        }

        this.loaded.flows = {
          time: new Date()
        }

        var persistentNotifications = {};
        RED.comms.subscribe("notification/#", function (topic, msg) {
          var parts = topic.split("/");
          var notificationId = parts[1];
          if (notificationId === "runtime-deploy") {
            // handled in ui/deploy.js
            return;
          }
          if (notificationId === "node") {
            // handled below
            return;
          }
          if (msg.text) {
            var text = RED._(msg.text, {
              default: msg.text
            });
            if (!persistentNotifications.hasOwnProperty(notificationId)) {
              persistentNotifications[notificationId] = RED.notify(text, msg.type, msg.timeout === undefined, msg.timeout);
            } else {
              persistentNotifications[notificationId].update(text, msg.timeout);
            }
          } else if (persistentNotifications.hasOwnProperty(notificationId)) {
            persistentNotifications[notificationId].close();
            delete persistentNotifications[notificationId];
          }
        });
        RED.comms.subscribe("status/#", function (topic, msg) {
          var parts = topic.split("/");
          var node = RED.nodes.node(parts[1]);
          if (node) {
            if (msg.hasOwnProperty("text")) {
              if (msg.text[0] !== ".") {
                msg.text = node._(msg.text.toString(), {
                  defaultValue: msg.text.toString()
                });
              }
            }
            node.status = msg;
            node.dirty = true;
            RED.view.redraw();
          }
        });
        RED.comms.subscribe("notification/node/#", function (topic, msg) {
          var i, m;
          var typeList;
          var info;
          if (topic == "notification/node/added") {
            var addedTypes = [];
            msg.forEach(function (m) {
              var id = m.id;
              RED.nodes.addNodeSet(m);
              addedTypes = addedTypes.concat(m.types);
              RED.i18n.loadCatalog(id, function () {
                $.get('nodes/' + id, function (data) {
                  $("body").append(data);
                });
              });
            });
            if (addedTypes.length) {
              typeList = "<ul><li>" + addedTypes.join("</li><li>") + "</li></ul>";
              RED.notify(RED._("palette.event.nodeAdded", {
                count: addedTypes.length
              }) + typeList, "success");
            }
          } else if (topic == "notification/node/removed") {
            for (i = 0; i < msg.length; i++) {
              m = msg[i];
              info = RED.nodes.removeNodeSet(m.id);
              if (info.added) {
                typeList = "<ul><li>" + m.types.join("</li><li>") + "</li></ul>";
                RED.notify(RED._("palette.event.nodeRemoved", {
                  count: m.types.length
                }) + typeList, "success");
              }
            }
          } else if (topic == "notification/node/enabled") {
            if (msg.types) {
              info = RED.nodes.getNodeSet(msg.id);
              if (info.added) {
                RED.nodes.enableNodeSet(msg.id);
                typeList = "<ul><li>" + msg.types.join("</li><li>") + "</li></ul>";
                RED.notify(RED._("palette.event.nodeEnabled", {
                  count: msg.types.length
                }) + typeList, "success");
              } else {
                $.get('nodes/' + msg.id, function (data) {
                  $("body").append(data);
                  typeList = "<ul><li>" + msg.types.join("</li><li>") + "</li></ul>";
                  RED.notify(RED._("palette.event.nodeAdded", {
                    count: msg.types.length
                  }) + typeList, "success");
                });
              }
            }
          } else if (topic == "notification/node/disabled") {
            if (msg.types) {
              RED.nodes.disableNodeSet(msg.id);
              typeList = "<ul><li>" + msg.types.join("</li><li>") + "</li></ul>";
              RED.notify(RED._("palette.event.nodeDisabled", {
                count: msg.types.length
              }) + typeList, "success");
            }
          } else if (topic == "node/upgraded") {
            RED.notify(RED._("palette.event.nodeUpgraded", {
              module: msg.module,
              version: msg.version
            }), "success");
            RED.nodes.registry.setModulePendingUpdated(msg.module, msg.version);
          }
          // Refresh flow library to ensure any examples are updated
          RED.library.loadFlowLibrary();
        });
      }
    });
  }

  showAbout() {
    const RED = this.RED;
    $.get('red/about', function (data) {
      var aboutHeader = '<div style="text-align:center;">' +
        '<img width="50px" src="red/images/node-red-icon.svg" />' +
        '</div>';

      RED.sidebar.info.set(aboutHeader + marked(data));
      RED.sidebar.info.show();
    });
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
      id: "menu-item-view-menu",
      label: RED._("menu.label.view.view"),
      options: [
        // {id:"menu-item-view-show-grid",setting:"view-show-grid",label:RED._("menu.label.view.showGrid"),toggle:true,onselect:"core:toggle-show-grid"},
        // {id:"menu-item-view-snap-grid",setting:"view-snap-grid",label:RED._("menu.label.view.snapGrid"),toggle:true,onselect:"core:toggle-snap-grid"},
        // {id:"menu-item-status",setting:"node-show-status",label:RED._("menu.label.displayStatus"),toggle:true,onselect:"core:toggle-status", selected: true},
        //null,
        // {id:"menu-item-bidi",label:RED._("menu.label.view.textDir"),options:[
        //     {id:"menu-item-bidi-default",toggle:"text-direction",label:RED._("menu.label.view.defaultDir"),selected: true, onselect:function(s) { if(s){RED.text.bidi.setTextDirection("")}}},
        //     {id:"menu-item-bidi-ltr",toggle:"text-direction",label:RED._("menu.label.view.ltr"), onselect:function(s) { if(s){RED.text.bidi.setTextDirection("ltr")}}},
        //     {id:"menu-item-bidi-rtl",toggle:"text-direction",label:RED._("menu.label.view.rtl"), onselect:function(s) { if(s){RED.text.bidi.setTextDirection("rtl")}}},
        //     {id:"menu-item-bidi-auto",toggle:"text-direction",label:RED._("menu.label.view.auto"), onselect:function(s) { if(s){RED.text.bidi.setTextDirection("auto")}}}
        // ]},
        // null,
        {
          id: "menu-item-sidebar",
          label: RED._("menu.label.sidebar.show"),
          toggle: true,
          onselect: "core:toggle-sidebar",
          selected: true
        },
        null
      ]
    });
    menuOptions.push(null);
    menuOptions.push({
      id: "menu-item-import",
      label: RED._("menu.label.import"),
      options: [{
        id: "menu-item-import-clipboard",
        label: RED._("menu.label.clipboard"),
        onselect: "core:show-import-dialog"
      },
      {
        id: "menu-item-import-library",
        label: RED._("menu.label.library"),
        options: []
      }
      ]
    });
    menuOptions.push({
      id: "menu-item-export",
      label: RED._("menu.label.export"),
      disabled: true,
      options: [{
        id: "menu-item-export-clipboard",
        label: RED._("menu.label.clipboard"),
        disabled: true,
        onselect: "core:show-export-dialog"
      },
      {
        id: "menu-item-export-library",
        label: RED._("menu.label.library"),
        disabled: true,
        onselect: "core:library-export"
      }
      ]
    });
    menuOptions.push(null);
    menuOptions.push({
      id: "menu-item-search",
      label: RED._("menu.label.search"),
      onselect: "core:search"
    });
    menuOptions.push(null);
    menuOptions.push({
      id: "menu-item-config-nodes",
      label: RED._("menu.label.displayConfig"),
      onselect: "core:show-config-tab"
    });
    menuOptions.push({
      id: "menu-item-workspace",
      label: RED._("menu.label.flows"),
      options: [{
        id: "menu-item-workspace-add",
        label: RED._("menu.label.add"),
        onselect: "core:add-flow"
      },
      {
        id: "menu-item-workspace-edit",
        label: RED._("menu.label.rename"),
        onselect: "core:edit-flow"
      },
      {
        id: "menu-item-workspace-delete",
        label: RED._("menu.label.delete"),
        onselect: "core:remove-flow"
      }
      ]
    });
    menuOptions.push({
      id: "menu-item-subflow",
      label: RED._("menu.label.subflows"),
      options: [{
        id: "menu-item-subflow-create",
        label: RED._("menu.label.createSubflow"),
        onselect: "core:create-subflow"
      },
      {
        id: "menu-item-subflow-convert",
        label: RED._("menu.label.selectionToSubflow"),
        disabled: true,
        onselect: "core:convert-to-subflow"
      },
      ]
    });
    menuOptions.push(null);
    if (RED.settings.theme('palette.editable') !== false) {
      menuOptions.push({
        id: "menu-item-edit-palette",
        label: RED._("menu.label.editPalette"),
        onselect: "core:manage-palette"
      });
      menuOptions.push(null);
    }

    menuOptions.push({
      id: "menu-item-user-settings",
      label: RED._("menu.label.settings"),
      onselect: "core:show-user-settings"
    });
    menuOptions.push(null);

    menuOptions.push({
      id: "menu-item-keyboard-shortcuts",
      label: RED._("menu.label.keyboardShortcuts"),
      onselect: "core:show-help"
    });
    menuOptions.push({
      id: "menu-item-help",
      label: RED.settings.theme("menu.menu-item-help.label", RED._("menu.label.help")),
      href: RED.settings.theme("menu.menu-item-help.url", "http://nodered.org/docs")
    });
    menuOptions.push({
      id: "menu-item-node-red-version",
      label: "v" + RED.settings.version,
      onselect: "core:show-about"
    });

    // TODO: All UI editor wiring should be done in ui/main loadEditor() method

    RED.actions = new Actions(RED)
    RED.clipboard = new Clipboard(RED)

    // RED.settings.theme("deployButton",null
    var deployCtx = RED.settings.theme('deployButton', null)
    RED.deploy = new Deploy(deployCtx)
    RED.diff = new NodeDiff()
    RED.editor = new Editor()
    RED.keyboard = new Keyboard(RED)
    RED.library = new Library()
    RED.notifications = new Notifications(RED)
    RED.search = new Search()
    RED.subflow = new Subflow()
    RED.tray = new Tray()
    RED.typeSearch = new TypeSearch()
    RED.userSettings = new UserSettings()
    RED.utils = new Utils(RED)
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

    // RED.view.init();
    // RED.userSettings.init();
    // RED.user.init();
    // RED.library.init();
    // RED.keyboard.init();
    // RED.palette.init();
    // if (RED.settings.theme('palette.editable') !== false) {
    //     RED.palette.editor.init();
    // }

    // RED.sidebar.init();
    // RED.subflow.init();
    // RED.workspaces.init();
    // RED.clipboard.init();
    // RED.search.init();
    // RED.editor.init();
    // RED.diff.init();

    // RED.menu.init({
    //     id: "btn-sidemenu",
    //     options: menuOptions
    // });

    // RED.deploy.init(RED.settings.theme("deployButton", null));

    RED.actions.add("core:show-about", showAbout);
    // RED.nodes.init();
    RED.comms.connect();

    $("#main-container").show();
    $(".header-toolbar").show();

    this.loadNodeList();

    this.loaded.editor = {
      time: new Date()
    }
  }

  resetLoaded() {
    this.loaded = {}
  }
}
