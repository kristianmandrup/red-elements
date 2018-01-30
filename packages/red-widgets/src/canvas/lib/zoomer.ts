import {
  Context
} from '../../context'
import { Canvas } from '../../'

import {
  container,
  delegate
} from './container'

@delegate({
  container,
})

export class CanvasZoomer extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * zoom In
   */
  zoomIn() {
    const {
      canvas,
      rebind
    } = this
    let {
      scaleFactor
    } = canvas
    const {
      redraw
    } = rebind([
        'redraw'
      ], canvas)

    if (scaleFactor < 2) {
      scaleFactor += 0.1;
      redraw();
    }
  }

  /**
   * zoom Out
   */
  zoomOut() {
    const {
      canvas,
      rebind
    } = this
    let {
      scaleFactor
    } = canvas
    const {
      redraw
    } = rebind([
        'redraw'
      ], canvas)

    if (scaleFactor > 0.3) {
      scaleFactor -= 0.1;
      redraw();
    }
  }

  /**
   * zoom Zero
   */
  zoomZero() {
    const {
      canvas,
      rebind
    } = this
    let {
      scaleFactor
    } = canvas
    const {
      redraw
    } = rebind([
        'redraw'
      ], canvas)

    scaleFactor = 1;
    redraw();
  }
}
