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
import { Context, $, EditableList, Searchbox } from '../../../common'

// TODO: Find I18n constructor in node-red
// import {
//   I18n
// } from 'i18n'

const { log } = console

interface ISearchResults extends JQuery<HTMLElement> {
  editableList: Function
}

import {
  SearchInputBuilder,
  ISearchInput
} from './input'

import {
  SearchResults
} from './results'

import {
  SearchConfiguration
} from './configuration'

export class Search extends Context {
  public disabled: Boolean = false
  public dialog: any = null
  public selected: any = -1
  public visible: Boolean = false
  public index: Object = {}
  public keys: Array<any> = []
  public results: Array<any> = []
  public searchResults: ISearchResults
  public searchInput: ISearchInput

  constructor() {
    super()

    // TODO: use SearchConfiguration delegate class
    this._prepareWidgetFactories()
    this._configureHandlers()
  }

  /**
   * Ensure required jQuery Widget factories are available
   * - searchResults: EditableList
   * - searchInput: Searchbox
   */
  protected _prepareWidgetFactories() {
    new EditableList()
    new Searchbox()
  }

  /**
   * Ensure RED context has actions and events containers
   */
  protected _validateContext() {
    const {
      ctx
    } = this
    const required = [
      'actions',
      'events'
    ]
    required.map(name => {
      if (!ctx[name]) {
        this.handleError(`Search: missing ${name} property on ctx`, {
          ctx
        })
      }
    })
  }

  protected _configureHandlers() {
    this._validateContext()
    this._configureActionHandlers()
    this._configureEditorEventHandlers()
    this._configureMouseEventHandlers()
  }

  protected _configureActionHandlers() {
    const {
      ctx
    } = this
    const {
      show
    } = this.rebind([
        'show'
      ])

    if (!ctx.actions.add) {
      this.handleError('Search: actions missing add method', {
        actions: ctx.actions
      })
    }
    ctx.actions.add('core:search', show);
  }


  protected _configureEditorEventHandlers() {
    const {
      ctx
    } = this
    const {
      enable,
      disable
    } = this.rebind([
        'enable',
        'disable'
      ])

    if (!ctx.events.on) {
      this.handleError('Search: events missing on method', {
        events: ctx.events
      })
    }

    ctx.events.on('editor:open', disable);
    ctx.events.on('editor:close', enable);
    ctx.events.on('type-search:open', disable);
    ctx.events.on('type-search:close', enable);
  }

  protected _configureMouseEventHandlers() {
    const {
      hide
    } = this.rebind([
        'hide'
      ])

    $('#header-shade').on('mousedown', hide);
    $('#editor-shade').on('mousedown', hide);
    $('#palette-shade').on('mousedown', hide);
    $('#sidebar-shade').on('mousedown', hide);
  }

  /**
   * Disable search
   */
  disable() {
    this.disabled = true;
  }

  /**
   * Enable search
   */
  enable() {
    this.disabled = false;
  }

  /**
   * ???
   * @param node
   */
  indexNode(node) {
    const {
      ctx,
      index
    } = this

    this._validateObj(ctx.utils, 'ctx.utils', 'indexNode')

    var label = ctx.utils.getNodeLabel(node);

    this._validateStr(label, 'label', 'indexNode')
    if (label) {
      label = ('' + label).toLowerCase();
      index[label] = index[label] || {};
      index[label][node.id] = {
        node,
        label
      }
    }
    label = label || node.label || node.name || node.id || '';

    var properties = ['id', 'type', 'name', 'label', 'info'];
    if (node._def && node._def.defaults) {
      properties = properties.concat(Object.keys(node._def.defaults));
    }
    for (var i = 0; i < properties.length; i++) {
      let prop = properties[i]
      if (node.hasOwnProperty(prop)) {
        var v = node[prop];
        if (typeof v === 'string' || typeof v === 'number') {
          v = ('' + v).toLowerCase();

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

  /**
   * ???
   */
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

  /**
   * Search for the value and populate searchResults with matches
   * Searches all keys of all nodes for a match, using indexOf to find any substring match
   *
   * @param val { string } value to search for
   */
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

      // convert search term to lowercase
      val = val.toLowerCase();
      var i;
      var j;
      var list = [];
      var nodes = {};

      // iterate all node keys
      // searches all keys of all nodes for a match
      // using indexOf to find any substring match
      // uses node indexes to find matching node?
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

      // populate search results
      for (i = 0; i < list.length; i++) {
        this.results.push(nodes[list[i]]);
      }

      // add results to editable list if results found
      if (this.results.length > 0) {
        for (i = 0; i < Math.min(this.results.length, 25); i++) {
          this.searchResults.editableList('addItem', this.results[i])
        }
      } else {
        // create empty editable list if no results found
        this.searchResults.editableList('addItem', {});
      }
    }
    return this
  }

  /**
   * Ensure selected is visible
   * Scrolls selected into view if not visible in viewport
   */
  ensureSelectedIsVisible() {
    var selectedEntry = this.searchResults.find('li.selected');
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

  /**
   * The selector for the main container elements
   */
  get $mainContainer() {
    return '#main-container'
  }

  /**
   * Create a search dialog container element
   */
  protected _createSearchDialog() {
    const {
      $mainContainer
    } = this

    return $('<div>', {
      id: 'red-ui-search',
      class: 'red-ui-search'
    }).appendTo($mainContainer);
  }

  /**
   * Create a search container element
   */
  protected _createSearchContainer() {
    const searchDialog = this._createSearchDialog()
    return $('<div>', {
      class: 'red-ui-search-container'
    }).appendTo(searchDialog);
  }

  /**
   * Configure Search results element
   * - turns element into an editableList
   * - adds addItem event handler
   */
  _configureSearchResultsElement() {
    let {
      ctx,
      dialog,
      results,
      selected,
      reveal
    } = this

    // TODO: use SearchResults helper class
    var searchResultsDiv = $('<div>', {
      class: 'red-ui-search-results-container'
    }).appendTo(dialog);

    const searchResults = <ISearchResults>$('<ol>', {
      id: 'search-result-list',
      style: 'position: absolute;top: 5px;bottom: 5px;left: 5px;right: 5px;'
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
            class: 'red-ui-search-empty'
          }).html(ctx._('search.empty')).appendTo(container);

        } else {
          var def = node._def;
          var div = $('<a>', {
            href: '#',
            class: 'red-ui-search-result'
          }).appendTo(container);

          var nodeDiv = $('<div>', {
            class: 'red-ui-search-result-node'
          }).appendTo(div);
          var colour = def.color;
          var icon_url = ctx.utils.getNodeIcon(def, node);
          if (node.type === 'tab') {
            colour = '#C0DEED';
          }
          nodeDiv.css('backgroundColor', colour);

          var iconContainer = $('<div/>', {
            class: 'palette_icon_container'
          }).appendTo(nodeDiv);
          $('<div/>', {
            class: 'palette_icon',
            style: 'background-image: url(' + icon_url + ')'
          }).appendTo(iconContainer);

          var contentDiv = $('<div>', {
            class: 'red-ui-search-result-description'
          }).appendTo(div);
          if (node.z) {
            var workspace = ctx.nodes.workspace(node.z);
            if (!workspace) {
              workspace = ctx.nodes.subflow(node.z);
              workspace = 'subflow:' + workspace.name;
            } else {
              workspace = 'flow:' + workspace.label;
            }
            $('<div>', {
              class: 'red-ui-search-result-node-flow'
            }).html(workspace).appendTo(contentDiv);
          }

          $('<div>', {
            class: 'red-ui-search-result-node-label'
          }).html(object.label || node.id).appendTo(contentDiv);
          $('<div>', {
            class: 'red-ui-search-result-node-type'
          }).html(node.type).appendTo(contentDiv);
          $('<div>', {
            class: 'red-ui-search-result-node-id'
          }).html(node.id).appendTo(contentDiv);

          div.click(function (evt) {
            evt.preventDefault();
            reveal(node);
          });
        }
      },
      scrollOnAdd: false
    });

    this.setInstanceVars({
      searchResults
    })

    return searchResults
  }

  protected _buildSearchInputElement() {
    // lazy instantiation
    const searchInputBuilder = new SearchInputBuilder(this)
    const searchInput = searchInputBuilder.buildSearchInputElement()

    this.setInstanceVars({
      searchInput
    })
  }

  /**
   * Create a search dialog with search input and results
   */
  createDialog() {
    // using delegate Builder class
    this._buildSearchInputElement()

    this._configureSearchResultsElement()
    return this
  }

  /**
   * Reveal a hidden node
   * @param node
   */
  reveal(node) {
    this.hide();
    this.ctx.view.reveal(node.id);
    return this
  }

  /**
   * Show all ???
   * TODO: When is this called/used? after search is complete?
   */
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
      ctx.keyboard.add('*', 'escape', function () {
        hide()
      });
      $('#header-shade').show();
      $('#editor-shade').show();
      $('#palette-shade').show();
      $('#sidebar-shade').show();
      $('#sidebar-separator').hide();
      indexWorkspace();
      if (dialog === null) {
        createDialog();
      }
      dialog.slideDown(300);
      ctx.events.emit('search:open');
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

  /**
   * See show
   *
   * TODO: add documentation - I think while searching, parts of UI are hidden?
   */
  hide() {
    let {
      ctx,
      dialog,
      visible,
      searchInput
    } = this

    if (visible) {
      ctx.keyboard.remove('escape');
      visible = false;
      $('#header-shade').hide();
      $('#editor-shade').hide();
      $('#palette-shade').hide();
      $('#sidebar-shade').hide();
      $('#sidebar-separator').show();
      if (dialog !== null) {
        dialog.slideUp(200, () => {
          searchInput.searchBox('value', '');
        });
      }
      ctx.events.emit('search:close');
    }
  }
}
