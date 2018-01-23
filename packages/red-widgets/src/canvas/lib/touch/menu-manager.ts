import {
  Context
} from '../../../context'
import { Canvas } from '../../';

export class CanvasTouchMenuManager extends Context {
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
        this.RED.editor.edit(mdn);
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
      disabled: (this.RED.history.depth() === 0),
      onselect: () => {
        this.RED.history.pop();
      }
    });

    this.RED.touch.radialMenu.show(obj, pos, options);
    resetMouseVars();
    return this
  }
}
