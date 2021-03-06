import {
  Canvas,
  Context,
  container,
  delegateTarget,
  lazyInject,
  $TYPES,
} from './_base'

import {
  INodes,
  IHistory,
} from '../../_interfaces'

import {
  IEvent
} from '@tecla5/red-base'


const TYPES = $TYPES.all

export interface ICanvasKeyboard {
  endKeyboardMove()
}

@delegateTarget()
export class CanvasKeyboard extends Context implements ICanvasKeyboard {

  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.history) $history: IHistory

  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * end Keyboard Move
   */
  endKeyboardMove() {
    const {
      canvas,

      $nodes,
      $history
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
      const event: IEvent = {
        t: 'move',
        nodes: ns,
        dirty: $nodes.dirty()
      }
      $history.push(event);
      $nodes.dirty(true);
    }

    setInstanceVars({
      endMoveSet
    }, canvas)
  }
}
