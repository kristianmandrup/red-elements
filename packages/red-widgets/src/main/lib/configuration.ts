import {
  Main,
  lazyInject,
  $TYPES,
  Context,
  $,
  EditableList,
  Menu,
  container,
  delegateTarget,
  log
} from './_base'

import {
  INodes,
  ISettings
} from '@tecla5/red-runtime'

import {
  I18n
} from '../../_interfaces'

const TYPES = $TYPES.all

export interface IMainConfiguration {
  configure()
}

/**
 * Main widget configuration
 */
@delegateTarget()
export class MainConfiguration extends Context implements IMainConfiguration {
  @lazyInject(TYPES.i18n) i18n: I18n
  @lazyInject(TYPES.settings) settings: ISettings

  constructor(public main: Main) {
    super()
  }

  /**
   * TODO
   */
  configure() {
    // ensure EditableList widget factory is available!
    new EditableList()

    const {
      RED,
      loadEditor
    } = this.rebind([
        'loadEditor'
      ])

    const {
      i18n,
      settings
    } = this

    // TODO: use configuration delegatate class pattern

    $(() => {
      if ((window.location.hostname !== 'localhost') && (window.location.hostname !== '127.0.0.1')) {
        document.title = document.title + ' : ' + window.location.hostname;
      }

      // Fix: using normal require: https://github.com/thlorenz/brace/tree/master/ext
      // ace.require
      require('brace/ext/language_tools');

      i18n.init(function () {
        settings.init(loadEditor);
      })
    });

  }
}
