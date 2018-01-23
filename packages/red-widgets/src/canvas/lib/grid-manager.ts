import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasGridManager extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * get size of grid
   * @param v
   */
  gridSize(v) {
    if (v === undefined) {
      return this.gridSize;
    } else {
      this.gridSize = v;
      this.updateGrid();
    }
  }

  /**
   * toggle Show Grid
   * @param state
   */
  toggleShowGrid(state) {
    const {
      grid
    } = this

    if (state) {
      grid.style('visibility', 'visible');
    } else {
      grid.style('visibility', 'hidden');
    }
    return this
  }

  /**
   * toggle Snap Grid
   * @param state
   */
  toggleSnapGrid(state) {
    const {
      redraw
    } = this

    this.snapGrid = state;
    redraw();
    return this
  }

  /**
   * update canvas Grid
   */
  updateGrid() {
    const {
      space_width,
      grid
    } = this.canvas

    var gridTicks = [];
    for (var i = 0; i < space_width; i += +this.gridSize) {
      gridTicks.push(i);
    }
    grid.selectAll('line.horizontal').remove();
    grid.selectAll('line.horizontal').data(gridTicks).enter()
      .append('line')
      .attr({
        'class': 'horizontal',
        'x1': 0,
        'x2': space_width,
        'y1': function (d) {
          return d;
        },
        'y2': function (d) {
          return d;
        },
        'fill': 'none',
        'shape-rendering': 'crispEdges',
        'stroke': '#eee',
        'stroke-width': '1px'
      });
    grid.selectAll('line.vertical').remove();
    grid.selectAll('line.vertical').data(gridTicks).enter()
      .append('line')
      .attr({
        'class': 'vertical',
        'y1': 0,
        'y2': space_width,
        'x1': (d) => {
          return d;
        },
        'x2': (d) => {
          return d;
        },
        'fill': 'none',
        'shape-rendering': 'crispEdges',
        'stroke': '#eee',
        'stroke-width': '1px'
      });
  }
}
