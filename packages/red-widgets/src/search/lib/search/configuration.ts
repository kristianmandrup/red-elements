import {
  Search
} from './'

import {
  Context,
  $,
  EditableList,
  Searchbox,
  container,
  delegateTarget
} from './_base'

/**
 * Takes care of search configuration, such as setting up event/action handlers
 */
@delegateTarget()
export class SearchConfiguration extends Context {
  constructor(public search: Search) {
    super()

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
}
