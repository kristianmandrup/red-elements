import { Main } from './index';
import {
  Context,
  EditableList,
  Menu
} from '../../common'

/**
 * TODO
 */
export class MainConfiguration extends Context {
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

    // TODO: use configuration delegatate class pattern

    $(() => {
      if ((window.location.hostname !== 'localhost') && (window.location.hostname !== '127.0.0.1')) {
        document.title = document.title + ' : ' + window.location.hostname;
      }

      // Fix: using normal require: https://github.com/thlorenz/brace/tree/master/ext
      // ace.require
      require('brace/ext/language_tools');

      RED.i18n.init(function () {
        RED.settings.init(loadEditor);
      })
    });

  }
}
