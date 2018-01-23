import {
  Context
} from '../../../context'
import { Canvas } from '../../';

export class CanvasTouchEventHandler extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * handle Outer Touch End Event
   * @param touchStartTime
   * @param lasso
   * @param canvasMouseUp
   */
  handleOuterTouchEndEvent(touchStartTime, lasso, canvasMouseUp) {
    clearTimeout(touchStartTime);
    touchStartTime = null;
    if (!this.RED.touch) {
      this.handleError('handleOuterTouchEndEvent: this.RED missing touch object', this.RED);
    }

    if (this.RED.touch.radialMenu.active()) {
      return;
    }
    if (lasso) {
      this.outer_background.attr('fill', '#fff');
    }
    canvasMouseUp.call(this);
  }

  /**
   * handle Outer Touch Start Event
   * @param touchStartTime
   * @param startTouchCenter
   * @param scaleFactor
   * @param startTouchDistance
   * @param touchLongPressTimeout
   */
  handleOuterTouchStartEvent(touchStartTime,
    startTouchCenter,
    scaleFactor,
    startTouchDistance,
    touchLongPressTimeout) {

    const {
      clearTimeout,
      showTouchMenu
    } = this.canvas

    var touch0;

    if (!d3.event) {
      this.logWarning('handleOuterTouchStartEvent: d3 missing event object', {
        // d3
        event: d3.event
      })
      return this
    }

    if (d3.event.touches.length > 1) {
      clearTimeout(touchStartTime);
      touchStartTime = null;
      d3.event.preventDefault();
      touch0 = d3.event.touches.item(0);
      var touch1 = d3.event.touches.item(1);
      var a = touch0['pageY'] - touch1['pageY'];
      var b = touch0['pageX'] - touch1['pageX'];

      var offset = $('#chart').offset();
      var scrollPos = [$('#chart').scrollLeft(), $('#chart').scrollTop()];
      startTouchCenter = [
        (touch1['pageX'] + (b / 2) - offset.left + scrollPos[0]) / scaleFactor,
        (touch1['pageY'] + (a / 2) - offset.top + scrollPos[1]) / scaleFactor
      ];
      this.moveTouchCenter = [
        touch1['pageX'] + (b / 2),
        touch1['pageY'] + (a / 2)
      ]
      startTouchDistance = Math.sqrt((a * a) + (b * b));
    } else {
      var obj = d3.select(document.body);
      touch0 = d3.event.touches.item(0);
      var pos = [touch0.pageX, touch0.pageY];
      startTouchCenter = [touch0.pageX, touch0.pageY];
      startTouchDistance = 0;

      // TODO: Fixed?
      const svgElem = this.vis
      var point = d3.touches(svgElem)[0];
      touchStartTime = setTimeout(() => {
        touchStartTime = null;
        showTouchMenu(obj, pos);
        //lasso = vis.append('rect')
        //    .attr('ox',point[0])
        //    .attr('oy',point[1])
        //    .attr('rx',2)
        //    .attr('ry',2)
        //    .attr('x',point[0])
        //    .attr('y',point[1])
        //    .attr('width',0)
        //    .attr('height',0)
        //    .attr('class','lasso');
        //outer_background.attr('fill','#e3e3f3');
      }, touchLongPressTimeout);
    }
  }

  handleOuterTouchMoveEvent(touchStartTime: any,
    startTouchCenter: any,
    lasso: any,
    canvasMouseMove: any,
    oldScaleFactor: any,
    scaleFactor: any,
    startTouchDistance: any) {

    const {
      clearTimeout
    } = this

    if (!d3.event) {
      this.logWarning('handleOuterTouchStartEvent: d3 missing event object', {
        // d3
        event: d3.event
      })
      return this
    }

    if (this.RED.touch.radialMenu.active()) {
      d3.event.preventDefault();
      return;
    }
    var touch0;
    if (d3.event.touches.length < 2) {
      if (touchStartTime) {
        touch0 = d3.event.touches.item(0);
        var dx = (touch0.pageX - startTouchCenter[0]);
        var dy = (touch0.pageY - startTouchCenter[1]);
        var d = Math.abs(dx * dx + dy * dy);
        if (d > 64) {
          clearTimeout(touchStartTime);
          touchStartTime = null;
        }
      } else if (lasso) {
        d3.event.preventDefault();
      }
      canvasMouseMove.call(this);
    } else {
      touch0 = d3.event.touches.item(0);
      var touch1 = d3.event.touches.item(1);
      var a = touch0['pageY'] - touch1['pageY'];
      var b = touch0['pageX'] - touch1['pageX'];
      var offset = $('#chart').offset();
      var scrollPos = [$('#chart').scrollLeft(), $('#chart').scrollTop()];
      var moveTouchDistance = Math.sqrt((a * a) + (b * b));
      var touchCenter = [
        touch1['pageX'] + (b / 2),
        touch1['pageY'] + (a / 2)
      ];

      if (!isNaN(moveTouchDistance)) {
        oldScaleFactor = scaleFactor;
        scaleFactor = Math.min(2, Math.max(0.3, scaleFactor + (Math.floor(((moveTouchDistance * 100) - (startTouchDistance * 100))) / 10000)));

        var deltaTouchCenter = [ // Try to pan whilst zooming - not 100%
          startTouchCenter[0] * (scaleFactor - oldScaleFactor), //-(touchCenter[0]-moveTouchCenter[0]),
          startTouchCenter[1] * (scaleFactor - oldScaleFactor) //-(touchCenter[1]-moveTouchCenter[1])
        ];

        startTouchDistance = moveTouchDistance;
        this.moveTouchCenter = touchCenter;

        $('#chart').scrollLeft(scrollPos[0] + deltaTouchCenter[0]);
        $('#chart').scrollTop(scrollPos[1] + deltaTouchCenter[1]);
        this.redraw();
      }
    }
  }
}
