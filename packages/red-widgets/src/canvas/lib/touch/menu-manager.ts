import {
  Context
} from '../../../context'
import { Canvas } from '../../';

import {
  lazyInject,
  $TYPES
} from '../../../_container'

import {
  IRadialMenu,
  IEditor,
  IHistory
} from '../../../_interfaces'

const TYPES = $TYPES.all

export class CanvasTouchMenuManager extends Context {
  @lazyInject(TYPES.touch.radialMenu) radialMenu: IRadialMenu
  @lazyInject(TYPES.editor) editor: IEditor
  @lazyInject(TYPES.history) history: IHistory

  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * show Touch Menu (touch devices only)
   * @param obj
   * @param pos
   */
  showTouchMenu(obj, pos) {
    const {
      mousedown_node,
      moving_set,
      clipboard,
      selected_link,

      // methods
      deleteSelection,
      copySelection,
      importNodes,
      selectAll,
      resetMouseVars,
  } = this.canvas

    const { history,
      editor,
      radialMenu
     } = this

    var mdn = mousedown_node;
    var options = [];
    options.push({
      name: 'delete',
      disabled: (moving_set.length === 0 && selected_link === null),
      onselect: () => {
        deleteSelection();
      }
    });
    options.push({
      name: 'cut',
      disabled: (moving_set.length === 0),
      onselect: () => {
        copySelection();
        deleteSelection();
      }
    });
    options.push({
      name: 'copy',
      disabled: (moving_set.length === 0),
      onselect: () => {
        copySelection();
      }
    });
    options.push({
      name: 'paste',
      disabled: (clipboard.length === 0),
      onselect: () => {
        importNodes(clipboard, false, true);
      }
    });
    options.push({
      name: 'edit',
      disabled: (moving_set.length != 1),
      onselect: () => {
        editor.edit(mdn);
      }
    });
    options.push({
      name: 'select',
      onselect: () => {
        selectAll();
      }
    });
    options.push({
      name: 'undo',
      disabled: (history.depth() === 0),
      onselect: () => {
        history.pop();
      }
    });

    radialMenu.show(obj, pos, options);
    resetMouseVars();
    return this
  }
}
