import {
  Canvas,
  Context,
  container,
  delegateTarget
} from './_base'

export interface ICanvasGridManager {
  /**
  * Grid Size
  * @param v
  */
  gridSize(v)
  /**
  * Toggle Show Grid
  * @param state
  */
  toggleShowGrid(state)

  /**
  * Toggle Snap Grid
  * @param state
  */
  toggleSnapGrid(state)
  /**
  * Update Grid
  */
  updateGrid()
}

@delegateTarget()
export class CanvasGridManager extends Context implements ICanvasGridManager {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * get size of grid
   * @param v
   */
  gridSize(v) {
    const {
      canvas,
      rebind
    } = this
    let {
      gridsize
    } = canvas
    const {
      updateGrid
    } = rebind([
        'updateGrid'
      ])

    if (v === undefined) {
      return gridsize;
    } else {
      gridsize = v;
      updateGrid();
    }
  }

  /**
   * toggle Show Grid
   * @param state
   */
  toggleShowGrid(state) {
    const {
      canvas,
    } = this
    const {
      grid
    } = canvas

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
      canvas,
      rebind
    } = this
    let {
      snapGrid
    } = canvas
    const {
      redraw
    } = rebind([
        'redraw'
      ])

    snapGrid = state;
    redraw();
    return this
  }

  /**
   * update canvas Grid
   */
  updateGrid() {
    const {
      canvas
    } = this
    const {
      space_width,
      grid,
      gridsize
    } = canvas

    var gridTicks = [];
    for (var i = 0; i < space_width; i += +gridsize) {
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
