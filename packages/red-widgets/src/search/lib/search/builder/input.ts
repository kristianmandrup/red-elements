import {
  Search
} from '../'

import {
  SearchContainerBuilder
} from './container'

interface ISearchboxWidget extends JQuery<HTMLElement> {
  searchBox: Function
}

export interface ISearchInput extends JQuery<HTMLElement> {
  i18n: Function
  searchBox: Function
}

import {
  Context,
  container,
  delegateTarget
} from './_base'

@delegateTarget()
export class SearchInputBuilder extends Context {
  constructor(public search: Search) {
    super()
  }

  _createSearchContainer(): JQuery<HTMLElement> {
    const builder = new SearchContainerBuilder(this.search)
    return builder.createSearchContainer()
  }

  /**
   * Create a search input element
   */
  protected _createSearchInput(searchDiv?: JQuery<HTMLElement>) {
    const {
      // searchDiv
    } = this.search
    const {
      search,
      _createSearchContainer
    } = this.rebind([
        'search',
        '_createSearchContainer'
      ], this.search)

    // TODO: we should not rely on protected search method here!
    // should be already available on Search instance once we call this method, or better pass as parameter
    searchDiv = searchDiv || this._createSearchContainer()

    const searchInputElem: ISearchboxWidget = <ISearchboxWidget>$('<input type="text" data-i18n="[placeholder]menu.label.searchInput">').appendTo(searchDiv)
    return searchInputElem.searchBox({
      delay: 200,
      change: () => {
        search($(this).val());
      }
    });
  }

  /**
   * Build and configure Search input element
   * - builds input element
   * - on keydown event handler
   */
  buildSearchInputElement() {
    let {
      RED,
      dialog,
      searchResults,
      results,
      selected,
      reveal
    } = this.search

    const {
      ensureSelectedIsVisible
    } = this.rebind([
        'ensureSelectedIsVisible'
      ])

    // TODO: use SearchInput helper class
    const searchInput = this._createSearchInput()

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
          ensureSelectedIsVisible();
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
          ensureSelectedIsVisible();
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

    // TODO: ensure i18n widget factory is instantiated! is i18n method native to jQuery UI??
    // new I18n()
    searchInput.i18n();

    return searchInput
  }

}
