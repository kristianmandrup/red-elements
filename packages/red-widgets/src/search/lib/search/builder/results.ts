import {
  Search
} from '../'

export interface ISearchResults extends JQuery<HTMLElement> {
  editableList: Function
}

import {
  Context,
  container,
  delegateTarget
} from './_base'

@delegateTarget({
  container
})
export class SearchResultsBuilder extends Context {
  constructor(public search: Search) {
    super()
  }

  /**
   * Configure Search results element
   * - turns element into an editableList
   * - adds addItem event handler
   */
  buildSearchResultsElement() {
    let {
      RED,
      dialog,
      results,
      selected,
      reveal
    } = this.search

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
          }).html(RED._('search.empty')).appendTo(container);

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
          var icon_url = RED.utils.getNodeIcon(def, node);
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
            var workspace = RED.nodes.workspace(node.z);
            if (!workspace) {
              workspace = RED.nodes.subflow(node.z);
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

    return searchResults
  }
}
