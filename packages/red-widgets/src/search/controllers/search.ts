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
import { Context, $, EditableList } from '../../common'

// TODO: Find I18n constructor in node-red
// import {
//   I18n
// } from 'i18n'

const { log } = console

interface ISearchResults extends JQuery<HTMLElement> {
  editableList: Function
}

interface ISearchboxWidget extends JQuery<HTMLElement> {
  searchBox: Function
}

interface ISearchInput extends JQuery<HTMLElement> {
  i18n: Function
  searchBox: Function
}

export class Search extends Context {
  public disabled: Boolean
  public dialog: any // Dialog ?
  public selected: any
  public visible: Boolean
  public index: Object
  public keys: Array<any>
  public results: Array<any>
  public searchResults: ISearchResults
  public searchInput: ISearchInput

  constructor() {
    super()
    const { ctx } = this

    // to ensure that searchResults can be converted to EditableList jQuery Widget
    new EditableList()

    this.disabled = false;
    this.dialog = null;
    this.selected = -1;
    this.visible = false;

    this.index = {};
    this.keys = [];
    this.results = [];
    const required = [
      'actions',
      'events'
    ]

    let {
      show,
      enable,
      disable
    } = this.rebind([
        'show',
        'enable',
        'disable'
      ])

    required.map(name => {
      if (!ctx[name]) {
        this.handleError(`Search: missing ${name} property on ctx`, {
          ctx
        })
      }
    })

    if (!ctx.actions.add) {
      this.handleError('Search: actions missing add method', {
        actions: ctx.actions
      })
    }

    ctx.actions.add("core:search", show);

    if (!ctx.events.on) {
      this.handleError('Search: events missing on method', {
        events: ctx.events
      })
    }

    ctx.events.on("editor:open", disable);
    ctx.events.on("editor:close", enable);
    ctx.events.on("type-search:open", disable);
    ctx.events.on("type-search:close", enable);

    $("#header-shade").on('mousedown', this.hide);
    $("#editor-shade").on('mousedown', this.hide);
    $("#palette-shade").on('mousedown', this.hide);
    $("#sidebar-shade").on('mousedown', this.hide);

  }

  disable() {
    this.disabled = true;
  }
  enable() {
    this.disabled = false;
  }

  indexNode(node) {
    const {
      ctx,
      index
    } = this

    this._validateObj(ctx.utils, 'ctx.utils', 'indexNode')

    var label = ctx.utils.getNodeLabel(node);

    this._validateStr(label, 'label', 'indexNode')
    if (label) {
      label = ("" + label).toLowerCase();
      index[label] = index[label] || {};
      index[label][node.id] = {
        node,
        label
      }
    }
    label = label || node.label || node.name || node.id || "";

    var properties = ['id', 'type', 'name', 'label', 'info'];
    if (node._def && node._def.defaults) {
      properties = properties.concat(Object.keys(node._def.defaults));
    }
    for (var i = 0; i < properties.length; i++) {
      let prop = properties[i]
      if (node.hasOwnProperty(prop)) {
        var v = node[prop];
        if (typeof v === 'string' || typeof v === 'number') {
          v = ("" + v).toLowerCase();

          let id = node.id
          this._validateStr(v, 'v', 'indexNode', prop)
          this._validateStr(id, 'node.id', 'indexNode', node)

          index[v] = index[v] || {};
          index[v][node.id] = {
            node,
            label
          };
        }
      }
    }
  }

  indexWorkspace() {
    let {
      ctx,
      keys,
      index,
      indexNode
    } = this

    index = {};
    if (!ctx.nodes) {
      this.handleError('indexWorkspace: ctx missing nodes object', {
        ctx
      })
    }

    ctx.nodes.eachWorkspace(indexNode);
    ctx.nodes.eachSubflow(indexNode);
    ctx.nodes.eachConfig(indexNode);
    ctx.nodes.eachNode(indexNode);
    keys = Object.keys(index);
    keys.sort();
    keys.forEach(function (key) {
      index[key] = Object.keys(index[key]).map(function (id) {
        return index[key][id];
      })
    })
    this.index = index
    return this
  }

  search(val) {
    let {
      keys,
      index,
      searchResults,
      selected,
      results
    } = this

    if (!searchResults.editableList) {
      this.handleError('search: searchResults missing editableList. Call createDialog to init searchResults', {
        searchResults
      })
    }

    searchResults.editableList('empty');
    selected = -1;
    results = [];
    if (val.length > 0) {
      val = val.toLowerCase();
      var i;
      var j;
      var list = [];
      var nodes = {};
      for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        var kpos = keys[i].indexOf(val);
        if (kpos > -1) {
          for (j = 0; j < index[key].length; j++) {
            var node = index[key][j];
            // fix?
            var idNode = nodes[node.node.id] = node
            idNode.index = Math.min(idNode.index || Infinity, kpos);
          }
        }
      }
      list = Object.keys(nodes);
      list.sort(function (A, B) {
        return nodes[A].index - nodes[B].index;
      });

      for (i = 0; i < list.length; i++) {
        this.results.push(nodes[list[i]]);
      }
      if (this.results.length > 0) {
        for (i = 0; i < Math.min(this.results.length, 25); i++) {
          this.searchResults.editableList('addItem', this.results[i])
        }
      } else {
        this.searchResults.editableList('addItem', {});
      }
    }
    return this
  }

  ensureSelectedIsVisible() {
    var selectedEntry = this.searchResults.find("li.selected");
    if (selectedEntry.length === 1) {
      var scrollWindow = this.searchResults.parent();
      var scrollHeight = scrollWindow.height();
      var scrollOffset = scrollWindow.scrollTop();
      var y = selectedEntry.position().top;
      var h = selectedEntry.height();
      if (y + h > scrollHeight) {
        scrollWindow.animate({
          scrollTop: '-=' + (scrollHeight - (y + h) - 10)
        }, 50);
      } else if (y < 0) {
        scrollWindow.animate({
          scrollTop: '+=' + (y - 10)
        }, 50);
      }
    }
  }

  createDialog() {
    let {
      ctx,
      dialog,
      search,
      searchInput,
      searchResults,
      results,
      selected,
      reveal
    } = this

    dialog = $("<div>", {
      id: "red-ui-search",
      class: "red-ui-search"
    }).appendTo("#main-container");
    var searchDiv = $("<div>", {
      class: "red-ui-search-container"
    }).appendTo(dialog);

    const searchInputElem: ISearchboxWidget = <ISearchboxWidget>$('<input type="text" data-i18n="[placeholder]menu.label.searchInput">').appendTo(searchDiv)
    searchInput = searchInputElem.searchBox({
      delay: 200,
      change: () => {
        search($(this).val());
      },
      // Fix: trying to add i18n support (better to do directly on widget)
      i18n: () => {
        // console.log('i18n not implemented')
      }
    });

    this.searchInput = searchInput

    searchInput.on('keydown', (evt) => {
      var children;
      if (results.length > 0) {
        if (evt.keyCode === 40) {
          // Down
          children = searchResults.children();
          if (selected < children.length - 1) {
            if (selected > -1) {
              $(children[selected]).removeClass('selected');
            }
            selected++;
          }
          $(children[selected]).addClass('selected');
          this.ensureSelectedIsVisible();
          evt.preventDefault();
        } else if (evt.keyCode === 38) {
          // Up
          children = searchResults.children();
          if (selected > 0) {
            if (selected < children.length) {
              $(children[selected]).removeClass('selected');
            }
            selected--;
          }
          $(children[selected]).addClass('selected');
          this.ensureSelectedIsVisible();
          evt.preventDefault();
        } else if (evt.keyCode === 13) {
          // Enter
          if (results.length > 0) {
            reveal(results[Math.max(0, selected)].node);
          }
        }
      }
    });
    if (!searchInput.i18n) {
      this.handleError('searchInput (searchBox widget) missing i18n function', {
        searchInput
      })
    }

    // TODO: ensure i18n widget factory is instantiated!
    // new I18n()
    searchInput.i18n();

    var searchResultsDiv = $("<div>", {
      class: "red-ui-search-results-container"
    }).appendTo(dialog);

    searchResults = <ISearchResults>$('<ol>', {
      id: "search-result-list",
      style: "position: absolute;top: 5px;bottom: 5px;left: 5px;right: 5px;"
    })
    searchResults.appendTo(searchResultsDiv)

    if (!searchResults.editableList) {
      this.handleError('createDialog: searchResults missing editableList. Call createDialog to init searchResults', {
        searchResults
      })
    }

    searchResults.editableList({
      addButton: false,
      addItem: (container, i, object) => {
        var node = object.node;
        if (node === undefined) {
          $('<div>', {
            class: "red-ui-search-empty"
          }).html(ctx._('search.empty')).appendTo(container);

        } else {
          var def = node._def;
          var div = $('<a>', {
            href: '#',
            class: "red-ui-search-result"
          }).appendTo(container);

          var nodeDiv = $('<div>', {
            class: "red-ui-search-result-node"
          }).appendTo(div);
          var colour = def.color;
          var icon_url = ctx.utils.getNodeIcon(def, node);
          if (node.type === 'tab') {
            colour = "#C0DEED";
          }
          nodeDiv.css('backgroundColor', colour);

          var iconContainer = $('<div/>', {
            class: "palette_icon_container"
          }).appendTo(nodeDiv);
          $('<div/>', {
            class: "palette_icon",
            style: "background-image: url(" + icon_url + ")"
          }).appendTo(iconContainer);

          var contentDiv = $('<div>', {
            class: "red-ui-search-result-description"
          }).appendTo(div);
          if (node.z) {
            var workspace = ctx.nodes.workspace(node.z);
            if (!workspace) {
              workspace = ctx.nodes.subflow(node.z);
              workspace = "subflow:" + workspace.name;
            } else {
              workspace = "flow:" + workspace.label;
            }
            $('<div>', {
              class: "red-ui-search-result-node-flow"
            }).html(workspace).appendTo(contentDiv);
          }

          $('<div>', {
            class: "red-ui-search-result-node-label"
          }).html(object.label || node.id).appendTo(contentDiv);
          $('<div>', {
            class: "red-ui-search-result-node-type"
          }).html(node.type).appendTo(contentDiv);
          $('<div>', {
            class: "red-ui-search-result-node-id"
          }).html(node.id).appendTo(contentDiv);

          div.click(function (evt) {
            evt.preventDefault();
            reveal(node);
          });
        }
      },
      scrollOnAdd: false
    });
    return this
  }

  reveal(node) {
    this.hide();
    this.ctx.view.reveal(node.id);
    return this
  }

  show() {
    let {
      ctx,
      dialog,
      disabled,
      visible,
      searchInput
    } = this

    const {
      hide,
      createDialog,
      indexWorkspace
    } = this.rebind([
        'indexWorkspace',
        'hide',
        'createDialog'
      ])

    if (disabled) {
      return this;
    }
    if (!visible) {
      ctx.keyboard.add("*", "escape", function () {
        hide()
      });
      $("#header-shade").show();
      $("#editor-shade").show();
      $("#palette-shade").show();
      $("#sidebar-shade").show();
      $("#sidebar-separator").hide();
      indexWorkspace();
      if (dialog === null) {
        createDialog();
      }
      dialog.slideDown(300);
      ctx.events.emit("search:open");
      visible = true;
    }
    if (!searchInput) {
      createDialog()
      searchInput = this.searchInput
    }

    this._validateObj(searchInput, 'searchInput', 'show')

    searchInput.focus();
    return this
  }

  hide() {
    let {
      ctx,
      dialog,
      visible,
      searchInput
    } = this

    if (visible) {
      ctx.keyboard.remove("escape");
      visible = false;
      $("#header-shade").hide();
      $("#editor-shade").hide();
      $("#palette-shade").hide();
      $("#sidebar-shade").hide();
      $("#sidebar-separator").show();
      if (dialog !== null) {
        dialog.slideUp(200, () => {
          searchInput.searchBox('value', '');
        });
      }
      ctx.events.emit("search:close");
    }
  }
}
