import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasZoomer extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * zoom In
   */
  zoomIn() {
    if (this.scaleFactor < 2) {
      this.scaleFactor += 0.1;
      this.redraw();
    }
  }

  /**
   * zoom Out
   */
  zoomOut() {
    if (this.scaleFactor > 0.3) {
      this.scaleFactor -= 0.1;
      this.redraw();
    }
  }

  /**
   * zoom Zero
   */
  zoomZero() {
    this.scaleFactor = 1;
    this.redraw();
  }
}
