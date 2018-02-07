import { Canvas } from '.'

import {
  d3,
  Context,
  container,
  delegateTarget,
  lazyInject,
  $TYPES
} from './_base'

import {
  INotifications
} from '../../_interfaces'
import { II18n } from '../../../../red-runtime/src/i18n/index';

const TYPES = $TYPES.all

export interface ICanvasButtonManager {
  isButtonEnabled(d): boolean
  nodeButtonClicked(d)
}

@delegateTarget()
export class CanvasButtonManager extends Context implements ICanvasButtonManager {
  // TODO: use $ prefix convention
  @lazyInject(TYPES.notifications) $notifications: INotifications
  @lazyInject(TYPES.i18n) $i18n: II18n

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
      $notifications,
      $i18n
    } = this
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
      $notifications.notify($i18n.t('notification.warning', {
        message: $i18n.t('notification.warnings.nodeActionDisabled')
      }), 'warning', "", 0);
    }
    d3.event.preventDefault();
  }
}
