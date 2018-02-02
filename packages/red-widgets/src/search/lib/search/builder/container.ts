import {
  Context,
  container,
  delegateTarget
} from './_base'

import {
  Search
} from '../'

export interface ISearchResults extends JQuery<HTMLElement> {
  editableList: Function
}

export interface ISearchContainerBuilder {
  /**
     * Create a search container element
     */
  createSearchContainer()
}

@delegateTarget()
export class SearchContainerBuilder extends Context implements ISearchContainerBuilder {
  constructor(public search: Search) {
    super()
  }

  /**
   * Create a search dialog container element
   */
  protected _createSearchDialog() {
    const {
      $mainContainer
    } = this.search

    return $('<div>', {
      id: 'red-ui-search',
      class: 'red-ui-search'
    }).appendTo($mainContainer);
  }

  /**
   * Create a search container element
   */
  createSearchContainer() {
    const searchDialog = this._createSearchDialog()
    return $('<div>', {
      class: 'red-ui-search-container'
    }).appendTo(searchDialog);
  }
}
