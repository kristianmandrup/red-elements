import { Canvas } from '.'

import {
  Context,
  container,
  delegateTarget
} from './_base'

export interface ICanvasTextCalculator {
  /**
   * calculate Text Width
   * @param str
   * @param className
   * @param offset
   */
  calculateTextWidth(str, className, offset)
}

@delegateTarget()
export class CanvasTextCalculator extends Context implements ICanvasTextCalculator {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * calculate Text Width
   * @param str
   * @param className
   * @param offset
   */
  calculateTextWidth(str, className, offset) {
    return this.calculateTextDimensions(str, className, offset, 0)[0];
  }

  /**
   * calculate Text Dimensions
   * @param str
   * @param className
   * @param offsetW
   * @param offsetH
   */
  protected calculateTextDimensions(str, className, offsetW, offsetH) {
    var sp = document.createElement('span');
    sp.className = className;
    sp.style.position = 'absolute';
    sp.style.top = '-1000px';
    sp.textContent = (str || '');
    document.body.appendChild(sp);
    var w = sp.offsetWidth;
    var h = sp.offsetHeight;
    document.body.removeChild(sp);
    return [offsetW + w, offsetH + h];
  }
}
