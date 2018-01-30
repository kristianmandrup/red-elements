import { Canvas } from '.'

import {
  Context,
  container,
  delegateTarget
} from './_base'

@delegateTarget({
  container,
})
export class CanvasKeyboard extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * end Keyboard Move
   */
  endKeyboardMove() {
    const {
      canvas
    } = this
    const {
      moving_set
    } = canvas
    const {
      redraw,
      setInstanceVars
    } = this.rebind([
        'redraw',
        'setInstanceVars'
      ], canvas)

    let {
      endMoveSet,
    } = canvas


    endMoveSet = false;
    if (moving_set.length > 0) {
      var ns = [];
      for (var i = 0; i < moving_set.length; i++) {
        ns.push({
          n: moving_set[i].n,
          ox: moving_set[i].ox,
          oy: moving_set[i].oy,
          moved: moving_set[i].n.moved
        });
        moving_set[i].n.moved = true;
        moving_set[i].n.dirty = true;
        delete moving_set[i].ox;
        delete moving_set[i].oy;
      }
      redraw();
      this.RED.history.push({
        t: 'move',
        nodes: ns,
        dirty: this.RED.nodes.dirty()
      });
      this.RED.nodes.dirty(true);
    }

    setInstanceVars({
      endMoveSet
    }, canvas)
  }
}
