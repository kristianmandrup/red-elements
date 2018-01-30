import {
  Context
} from '../../context'
import { Canvas } from '../../';

import {
  d3
} from './d3'

import {
  container,
  delegateTarget
} from './container'

@delegateTarget({
  container,
})
export class CanvasConfiguration extends Context {
  disabled: boolean

  constructor(protected canvas: Canvas) {
    super()
  }

  configure() {
    const {
      rebind,
      canvas
    } = this

    const {
      configureD3,
      configureHandlers,
      configureActions,
      configureEvents
      } = rebind([
        'configureD3',
        'configureHandlers',
        'configureActions',
        'configureEvents'
      ], canvas)

    configureD3()
    configureHandlers()
    configureActions()
    configureEvents()
    return this
  }

  configureD3() {
    const {
      RED,
      canvas,
      logInfo,
      setInstanceVars,
      rebind

    } = this
    let {
      space_width,
      space_height,
      lasso,
      startTouchCenter,
      scaleFactor,
      startTouchDistance,
      touchLongPressTimeout,
      oldScaleFactor,
      outer_background,
      dragGroup,
      grid,

    } = canvas

    // handleOuterTouchStartEvent = handleOuterTouchStartEvent.bind(this)
    // handleOuterTouchEndEvent = handleOuterTouchEndEvent.bind(this)

    // TODO: use rebind?
    const {
      handleOuterTouchStartEvent,
      handleOuterTouchEndEvent,
      canvasMouseUp,
      updateGrid,
      canvasMouseMove,
      canvasMouseDown,

      handleD3MouseDownEvent,
      handleOuterTouchMoveEvent,
      touchStartTime,
    } = rebind([
        'handleOuterTouchStartEvent',
        'handleOuterTouchEndEvent',
        'canvasMouseUp',
        'updateGrid',
        'canvasMouseMove',
        'canvasMouseDown',

        'handleD3MouseDownEvent',
        'handleOuterTouchMoveEvent',
        'touchStartTime',
      ], canvas)


    logInfo('create outer', {
      space_width,
      space_height,
      handleD3MouseDownEvent
    })

    const outer = d3.select('#chart')
      .append('svg:svg')
      .attr('width', space_width)
      .attr('height', space_height)
      .attr('pointer-events', 'all')
      .style('cursor', 'crosshair')
      .on('mousedown', handleD3MouseDownEvent); // outer is this

    canvas.outer = outer

    logInfo('create vis', {
      outer,
      canvasMouseMove,
      canvasMouseDown,
      canvasMouseUp
    })

    const vis = outer
      .append('svg:g')
      .on('dblclick.zoom', null)
      .append('svg:g')
      .attr('class', 'innerCanvas')
      .on('mousemove', canvasMouseMove) // vis is this
      .on('mousedown', canvasMouseDown) // vis is this
      .on('mouseup', canvasMouseUp) // vis is this

    canvas.vis = vis

    const touchMoveHandler = handleOuterTouchMoveEvent //(touchStartTime, startTouchCenter, lasso, canvasMouseMove, oldScaleFactor, scaleFactor, startTouchDistance)
    const outerTouchHandler = handleOuterTouchEndEvent // (touchStartTime, lasso, canvasMouseUp)
    const touchStartHandler = handleOuterTouchStartEvent// (touchStartTime, startTouchCenter, scaleFactor, startTouchDistance, touchLongPressTimeout)

    vis
      .on('touchend', outerTouchHandler)
      .on('touchcancel', canvasMouseUp) // vis is this
      .on('touchstart', touchStartHandler)
      .on('touchmove', touchMoveHandler); // vis is this

    logInfo('create outer_background', {
      vis,
    })

    outer_background = vis.append('svg:rect')
      .attr('width', space_width)
      .attr('height', space_height)
      .attr('fill', '#fff')


    logInfo('configureD3', {
      vis,
      outer
    })

    grid = vis.append('g')
    updateGrid()
    dragGroup = vis.append('g')

    setInstanceVars({
      dragGroup,
      grid,
      outer_background
    }, canvas)

    return this
  }

  configureEvents() {
    const {
      RED,
      rebind,
      canvas
    } = this

    const {
      workspaceScrollPositions
    } = canvas
    const {
      handleWorkSpaceChangeEvent,
    } = rebind([
        'handleWorkSpaceChangeEvent'
      ], canvas)

    RED.events.on('workspace:change', (evt) => handleWorkSpaceChangeEvent(evt, workspaceScrollPositions));
  }

  configureHandlers() {
    const {
      RED,
      canvas,
      rebind
    } = this
    const {
      snapGrid,
      gridsize,
      scrollTop,
      scrollLeft,
      scaleFactor,
      moving_set
    } = canvas

    const {
      zoomOut,
      zoomZero,
      zoomIn,
      addNode,
      clearSelection,
      updateActiveNodes,
      updateSelection,
      redraw,
    } = rebind([
        'zoomOut',
        'zoomZero',
        'zoomIn',
        'addNode',
        'clearSelection',
        'updateActiveNodes',
        'updateSelection',
        'redraw',
      ], canvas)

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
        var result = addNode(selected_tool, null, null);
        if (!result) {
          return;
        }
        var historyEvent: any = result.historyEvent;
        var nn: any = result.node;

        var helperOffset = d3.touches(ui.helper.get(0))[0] || d3.mouse(ui.helper.get(0));

        // TODO: Fixed ?
        const svgElem = chart
        var mousePos: any = d3.touches(svgElem)[0] || d3.mouse(svgElem);

        mousePos[1] += scrollTop + ((nn.h / 2) - helperOffset[1]);
        mousePos[0] += scrollLeft + ((nn.w / 2) - helperOffset[0]);
        mousePos[1] /= scaleFactor;
        mousePos[0] /= scaleFactor;

        if (snapGrid) {
          mousePos[0] = gridsize * (Math.ceil(mousePos[0] / gridsize));
          mousePos[1] = gridsize * (Math.ceil(mousePos[1] / gridsize));
        }
        nn.x = mousePos[0];
        nn.y = mousePos[1];

        var spliceLink = $(ui.helper).data('splice');
        if (spliceLink) {
          // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
          RED.nodes.removeLink(spliceLink);
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
          RED.nodes.addLink(link1);
          RED.nodes.addLink(link2);
          historyEvent.links = [link1, link2];
          historyEvent.removedLinks = [spliceLink];
        }

        RED.history.push(historyEvent);
        RED.nodes.add(nn);
        RED.editor.validateNode(nn);
        RED.nodes.dirty(true);
        // auto select dropped node - so info shows (if visible)
        clearSelection();
        nn.selected = true;
        moving_set.push({
          n: nn
        });
        updateActiveNodes();
        updateSelection();
        redraw();

        if (nn._def.autoedit) {
          RED.editor.edit(nn);
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
      RED,
      canvas,
      rebind
    } = this

    const {
      copySelection,
      deleteSelection,
      importNodes,
      selectAll,
      zoomIn,
      zoomOut,
      zoomZero,
      moveSelection,
      clipboard
    } = canvas

    const {
      toggleShowGrid,
      toggleSnapGrid,
      toggleStatus,
      editSelection
    } = rebind([
        'toggleSnapGrid',
        'toggleShowGrid',
        'toggleStatus',
        'editSelection'
      ], canvas)


    RED.actions.add('core:copy-selection-to-internal-clipboard', copySelection);
    RED.actions.add('core:cut-selection-to-internal-clipboard', () => {
      copySelection();
      deleteSelection();
    });
    RED.actions.add('core:paste-from-internal-clipboard', () => {
      importNodes(clipboard);
    });
    RED.actions.add('core:delete-selection', deleteSelection);
    RED.actions.add('core:edit-selected-node', editSelection);
    RED.actions.add('core:undo', RED.history.pop);
    RED.actions.add('core:select-all-nodes', selectAll);
    RED.actions.add('core:zoom-in', zoomIn);
    RED.actions.add('core:zoom-out', zoomOut);
    RED.actions.add('core:zoom-reset', zoomZero);

    RED.actions.add('core:toggle-show-grid', (state) => {
      if (state === undefined) {
        RED.userSettings.toggle('view-show-grid');
      } else {
        toggleShowGrid(state);
      }
    });
    RED.actions.add('core:toggle-snap-grid', (state) => {
      if (state === undefined) {
        RED.userSettings.toggle('view-snap-grid');
      } else {
        toggleSnapGrid(state);
      }
    });
    RED.actions.add('core:toggle-status', (state) => {
      if (state === undefined) {
        RED.userSettings.toggle('view-node-status');
      } else {
        toggleStatus(state);
      }
    });

    RED.actions.add('core:move-selection-up', () => {
      moveSelection(0, -1);
    });
    RED.actions.add('core:step-selection-up', () => {
      moveSelection(0, -20);
    });
    RED.actions.add('core:move-selection-right', () => {
      moveSelection(1, 0);
    });
    RED.actions.add('core:step-selection-right', () => {
      moveSelection(20, 0);
    });
    RED.actions.add('core:move-selection-down', () => {
      moveSelection(0, 1);
    });
    RED.actions.add('core:step-selection-down', () => {
      moveSelection(0, 20);
    });
    RED.actions.add('core:move-selection-left', () => {
      moveSelection(-1, 0);
    });
    RED.actions.add('core:step-selection-left', () => {
      moveSelection(-20, 0);
    });
    return this
  }

}
