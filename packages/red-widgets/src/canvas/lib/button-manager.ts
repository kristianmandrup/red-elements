import { Canvas } from '.'

import {
  d3,
  Context,
  container,
  delegateTarget
} from './_base'

export interface ICanvasButtonManager {
  isButtonEnabled(d): boolean
  nodeButtonClicked(d)
}

@delegateTarget({
  container,
})
export class CanvasButtonManager extends Context implements ICanvasButtonManager {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * check if Button is Enabled
   * @param d
   */
  isButtonEnabled(d): boolean {
    let buttonEnabled = true;
    if (d._def.button.hasOwnProperty('enabled')) {
      if (typeof d._def.button.enabled === 'function') {
        buttonEnabled = d._def.button.enabled.call(d);
      } else {
        buttonEnabled = d._def.button.enabled;
      }
    }
    return buttonEnabled;
  }

  /**
   * Node button click handler
   * @param d
   */
  nodeButtonClicked(d) {
    const {
      activeSubflow,
      redraw
    } = this.canvas

    if (!activeSubflow) {
      if (d._def.button.toggle) {
        d[d._def.button.toggle] = !d[d._def.button.toggle];
        d.dirty = true;
      }
      if (d._def.button.onclick) {
        try {
          d._def.button.onclick.call(d);
        } catch (err) {
          console.log('Definition error: ' + d.type + '.onclick', err);
        }
      }
      if (d.dirty) {
        redraw();
      }
    } else {
      this.RED.notify(this.RED._('notification.warning', {
        message: this.RED._('notification.warnings.nodeActionDisabled')
      }), 'warning');
    }
    d3.event.preventDefault();
  }
}
