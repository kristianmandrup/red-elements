import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasConfiguration extends Context {
  disabled: boolean

  constructor(protected canvas: Canvas) {
    super()
  }

  configure() {
    this.configureD3()
    this.configureHandlers()
    this.configureActions()
    this.configureEvents()
    return this
  }

  configureD3() {
    let {
      space_width,
      space_height,

      canvasMouseMove,
      canvasMouseDown,

      handleD3MouseDownEvent,
      handleOuterTouchMoveEvent,
      touchStartTime,
      lasso,
      startTouchCenter,
      scaleFactor,
      startTouchDistance,
      touchLongPressTimeout,
      oldScaleFactor,
    } = this.canvas

    // handleOuterTouchStartEvent = handleOuterTouchStartEvent.bind(this)
    // handleOuterTouchEndEvent = handleOuterTouchEndEvent.bind(this)

    // TODO: use rebind?
    const {
      handleOuterTouchStartEvent,
      handleOuterTouchEndEvent,
      canvasMouseUp
    } = this.rebind([
        'handleOuterTouchStartEvent',
        'handleOuterTouchEndEvent',
        'canvasMouseUp'
      ])


    log('create outer', {
      space_width,
      space_height,
      handleD3MouseDownEvent
    })
    var outer = d3.select('#chart')
      .append('svg:svg')
      .attr('width', space_width)
      .attr('height', space_height)
      .attr('pointer-events', 'all')
      .style('cursor', 'crosshair')
      .on('mousedown', handleD3MouseDownEvent); // outer is this

    this.outer = outer

    log('create vis', {
      outer,
      canvasMouseMove,
      canvasMouseDown,
      canvasMouseUp
    })
    var vis = outer
      .append('svg:g')
      .on('dblclick.zoom', null)
      .append('svg:g')
      .attr('class', 'innerCanvas')
      .on('mousemove', canvasMouseMove) // vis is this
      .on('mousedown', canvasMouseDown) // vis is this
      .on('mouseup', canvasMouseUp) // vis is this
    this.vis = vis

    const touchMoveHandler = handleOuterTouchMoveEvent(touchStartTime, startTouchCenter, lasso, canvasMouseMove, oldScaleFactor, scaleFactor, startTouchDistance)
    const outertTouchHandler = handleOuterTouchEndEvent(touchStartTime, lasso, canvasMouseUp)
    const touchStartHandler = handleOuterTouchStartEvent(touchStartTime, startTouchCenter, scaleFactor, startTouchDistance, touchLongPressTimeout)

    vis
      .on('touchend', outertTouchHandler)
      .on('touchcancel', canvasMouseUp) // vis is this
      .on('touchstart', touchStartHandler)
      .on('touchmove', touchMoveHandler); // vis is this

    log('create outer_background', {
      vis,
    })
    this.outer_background = vis.append('svg:rect')
      .attr('width', space_width)
      .attr('height', space_height)
      .attr('fill', '#fff')


    log({
      vis,
      outer
    })
    this.grid = vis.append('g')
    this.updateGrid()
    this.dragGroup = vis.append('g')
    return this
  }

  configureEvents() {
    // let {
    //   handleWorkSpaceChangeEvent
    // } = this

    // TODO: use rebind?
    // handleWorkSpaceChangeEvent = handleWorkSpaceChangeEvent.bind(this);
    let {
      handleWorkSpaceChangeEvent,
    } = this.rebind([
        'handleWorkSpaceChangeEvent'
      ])

    this.RED.events.on('workspace:change', (evt) => handleWorkSpaceChangeEvent(evt, this.workspaceScrollPositions));
  }

  configureHandlers() {
    const {
      zoomOut,
      zoomZero,
      zoomIn,
      addNode,
      clearSelection,
      updateActiveNodes,
      updateSelection,
      redraw,
    } = this

    $('#btn-zoom-out').click(() => {
      zoomOut();
    });
    $('#btn-zoom-zero').click(() => {
      zoomZero();
    });
    $('#btn-zoom-in').click(() => {
      zoomIn();
    });
    $('#chart').on('DOMMouseScroll mousewheel', (evt: any) => {
      if (evt.altKey) {
        evt.preventDefault();
        evt.stopPropagation();
        var move = -(evt.originalEvent.detail) || evt.originalEvent.wheelDelta;
        if (move <= 0) {
          zoomOut();
        } else {
          zoomIn();
        }
      }
    });

    // Handle nodes dragged from the palette
    const chart = (<any>$('#chart'))
    chart.droppable({
      accept: '.palette_node',
      drop: (event: any, ui: any) => {
        // TODO: Fix
        // d3.event = event;
        var selected_tool = ui.draggable[0].type;
        var result = this.addNode(selected_tool, null, null);
        if (!result) {
          return;
        }
        var historyEvent: any = result.historyEvent;
        var nn: any = result.node;

        var helperOffset = d3.touches(ui.helper.get(0))[0] || d3.mouse(ui.helper.get(0));

        // TODO: Fixed ?
        const svgElem = chart
        var mousePos: any = d3.touches(svgElem)[0] || d3.mouse(svgElem);

        mousePos[1] += this.scrollTop + ((nn.h / 2) - helperOffset[1]);
        mousePos[0] += this.scrollLeft + ((nn.w / 2) - helperOffset[0]);
        mousePos[1] /= this.scaleFactor;
        mousePos[0] /= this.scaleFactor;

        if (this.snapGrid) {
          mousePos[0] = this.gridsize * (Math.ceil(mousePos[0] / this.gridsize));
          mousePos[1] = this.gridsize * (Math.ceil(mousePos[1] / this.gridsize));
        }
        nn.x = mousePos[0];
        nn.y = mousePos[1];

        var spliceLink = $(ui.helper).data('splice');
        if (spliceLink) {
          // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
          this.RED.nodes.removeLink(spliceLink);
          var link1 = {
            source: spliceLink.source,
            sourcePort: spliceLink.sourcePort,
            target: nn
          };
          var link2 = {
            source: nn,
            sourcePort: 0,
            target: spliceLink.target
          };
          this.RED.nodes.addLink(link1);
          this.RED.nodes.addLink(link2);
          historyEvent.links = [link1, link2];
          historyEvent.removedLinks = [spliceLink];
        }

        this.RED.history.push(historyEvent);
        this.RED.nodes.add(nn);
        this.RED.editor.validateNode(nn);
        this.RED.nodes.dirty(true);
        // auto select dropped node - so info shows (if visible)
        clearSelection();
        nn.selected = true;
        this.moving_set.push({
          n: nn
        });
        updateActiveNodes();
        updateSelection();
        this.redraw();

        if (nn._def.autoedit) {
          this.RED.editor.edit(nn);
        }
      }
    });
    $('#chart').focus(function () {
      $('#workspace-tabs').addClass('workspace-focussed')
    });
    $('#chart').blur(function () {
      $('#workspace-tabs').removeClass('workspace-focussed')
    });
    return this
  }

  configureActions() {
    const {
      copySelection,
      deleteSelection,
      importNodes,
      selectAll,
      zoomIn,
      zoomOut,
      zoomZero,
      toggleShowGrid,
      toggleSnapGrid,
      moveSelection
    } = this

    this.RED.actions.add('core:copy-selection-to-internal-clipboard', copySelection);
    this.RED.actions.add('core:cut-selection-to-internal-clipboard', () => {
      copySelection();
      deleteSelection();
    });
    this.RED.actions.add('core:paste-from-internal-clipboard', () => {
      this.importNodes(this.clipboard);
    });
    this.RED.actions.add('core:delete-selection', deleteSelection);
    this.RED.actions.add('core:edit-selected-node', this.editSelection);
    this.RED.actions.add('core:undo', this.RED.history.pop);
    this.RED.actions.add('core:select-all-nodes', selectAll);
    this.RED.actions.add('core:zoom-in', zoomIn);
    this.RED.actions.add('core:zoom-out', zoomOut);
    this.RED.actions.add('core:zoom-reset', zoomZero);

    this.RED.actions.add('core:toggle-show-grid', (state) => {
      if (state === undefined) {
        this.RED.userSettings.toggle('view-show-grid');
      } else {
        toggleShowGrid(state);
      }
    });
    this.RED.actions.add('core:toggle-snap-grid', (state) => {
      if (state === undefined) {
        this.RED.userSettings.toggle('view-snap-grid');
      } else {
        toggleSnapGrid(state);
      }
    });
    this.RED.actions.add('core:toggle-status', (state) => {
      if (state === undefined) {
        this.RED.userSettings.toggle('view-node-status');
      } else {
        this.toggleStatus(state);
      }
    });

    this.RED.actions.add('core:move-selection-up', () => {
      moveSelection(0, -1);
    });
    this.RED.actions.add('core:step-selection-up', () => {
      moveSelection(0, -20);
    });
    this.RED.actions.add('core:move-selection-right', () => {
      moveSelection(1, 0);
    });
    this.RED.actions.add('core:step-selection-right', () => {
      moveSelection(20, 0);
    });
    this.RED.actions.add('core:move-selection-down', () => {
      moveSelection(0, 1);
    });
    this.RED.actions.add('core:step-selection-down', () => {
      moveSelection(0, 20);
    });
    this.RED.actions.add('core:move-selection-left', () => {
      moveSelection(-1, 0);
    });
    this.RED.actions.add('core:step-selection-left', () => {
      moveSelection(-20, 0);
    });
    return this
  }

}
