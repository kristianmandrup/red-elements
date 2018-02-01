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
type JQElem = JQuery<HTMLElement>

import {
  SearchInputBuilder,
  ISearchInput,
  SearchResultsBuilder,
  ISearchResults
} from './builder'

import {
  SearchConfiguration
} from './configuration'

import {
  Context,
  $,
  container,
  delegator
} from './_base'

export interface ISearch {
  /**
   * Disable search
   */
  disable()

  /**
   * Enable search
   */
  enable()

  /**
   * ???
   * @param node
   */
  indexNode(node)

  /**
   * ???
   */
  indexWorkspace()

  /**
   * Search for the value and populate searchResults with matches
   * Searches all keys of all nodes for a match, using indexOf to find any substring match
   *
   * @param val { string } value to search for
   */
  search(val: string)

  /**
   * Ensure selected is visible
   * Scrolls selected into view if not visible in viewport
   */
  ensureSelectedIsVisible()

  /**
   * Create a search dialog with search input and results
   */
  createDialog()

  /**
   * Reveal a hidden node
   * @param node
   */
  reveal(node)

  /**
   * Show all ???
   * TODO: When is this called/used? after search is complete?
   */
  show()

  /**
   * See show
   *
   * TODO: add documentation - I think while searching, parts of UI are hidden?
   */
  hide()
}

@delegator({
  container,
  map: {
    configuration: SearchConfiguration
  }
})
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

  /**
   * The selector for the main container elements
   */
  $mainContainer: JQElem = $('#main-container')

  protected $headerShade: JQElem = $('#header-shade')
  protected $editorShade: JQElem = $('#editor-shade')
  protected $paletteShade: JQElem = $('#palette-shade')
  protected $sidebarShade: JQElem = $('#sidebar-shade')
  protected $sidebarSeparator: JQElem = $('#sidebar-separator')

  protected configuration: SearchConfiguration // = new SearchConfiguration(this)

  constructor() {
    super()
    // use SearchConfiguration delegate class to configure

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
      RED,
      index
    } = this

    this._validateObj(RED.utils, 'RED.utils', 'indexNode')

    var label = RED.utils.getNodeLabel(node);

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
      RED,
      keys,
      index,
      indexNode
    } = this

    index = {};
    if (!RED.nodes) {
      this.handleError('indexWorkspace: RED missing nodes object', {
        RED
      })
    }

    RED.nodes.eachWorkspace(indexNode);
    RED.nodes.eachSubflow(indexNode);
    RED.nodes.eachConfig(indexNode);
    RED.nodes.eachNode(indexNode);
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

      // scroll up if needed
      if (y + h > scrollHeight) {
        scrollWindow.animate({
          scrollTop: '-=' + (scrollHeight - (y + h) - 10)
        }, 50);
      }
      // scroll down if y too low
      if (y < 0) {
        scrollWindow.animate({
          scrollTop: '+=' + (y - 10)
        }, 50);
      }
    }
  }

  /**
   * Build SearchResults element using delegate builder class
   */
  protected _buildSearchResultsElement() {
    // lazy instantiation
    const searchResultsBuilder = new SearchResultsBuilder(this)
    const searchResults = searchResultsBuilder.buildSearchResultsElement()

    this.setInstanceVars({
      searchResults
    })
  }

  /**
   * Build SearchInput element using delegate builder class
   */
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
    this._buildSearchInputElement()
    this._buildSearchResultsElement()
    return this
  }

  /**
   * Reveal a hidden node
   * @param node
   */
  reveal(node) {
    this.hide();
    this.RED.view.reveal(node.id);
    return this
  }

  /**
   * Show all ???
   * TODO: When is this called/used? after search is complete?
   */
  show() {
    const {
      RED,
      dialog,
      disabled,

      $headerShade,
      $editorShade,
      $paletteShade,
      $sidebarShade,
      $sidebarSeparator
    } = this

    let {
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
      RED.keyboard.add('*', 'escape', function () {
        hide()
      });

      // toggle visibility
      $headerShade.show()
      $editorShade.show()
      $paletteShade.show()
      $sidebarShade.show()
      $sidebarSeparator.hide()

      indexWorkspace();
      if (dialog === null) {
        createDialog();
      }
      dialog.slideDown(300);
      RED.events.emit('search:open');
      visible = true;
    }
    if (!searchInput) {
      createDialog()
      searchInput = this.searchInput
    }

    this._validateObj(searchInput, 'searchInput', 'show')

    this.setInstanceVars({
      visible,
      searchInput
    })

    searchInput.focus();
    return this
  }

  /**
   * See show
   *
   * TODO: add documentation - I think while searching, parts of UI are hidden?
   */
  hide() {
    const {
      RED,
      dialog,
      searchInput,

      $headerShade,
      $editorShade,
      $paletteShade,
      $sidebarShade,
      $sidebarSeparator
    } = this
    let {
      visible
    } = this

    if (visible) {
      RED.keyboard.remove('escape');
      visible = false;

      // toggle visibility
      $headerShade.hide();
      $editorShade.hide();
      $paletteShade.hide();
      $sidebarShade.hide();
      $sidebarSeparator.show();

      if (dialog !== null) {
        dialog.slideUp(200, () => {
          searchInput.searchBox('value', '');
        });
      }

      this.setInstanceVars({
        visible
      })
      RED.events.emit('search:close');
    }
  }
}
