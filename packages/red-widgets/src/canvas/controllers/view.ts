/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import {
  Context
} from './context'

import * as d3 from 'd3'
import * as $ from 'jquery';
import { IRED, TYPES, container } from '../../setup/setup';
import getDecorators from 'inversify-inject-decorators';
import { Container, injectable, tagged, named } from 'inversify';
let { lazyInject } = getDecorators(container);
const {
  log
} = console
const PORT_TYPE_INPUT = 1;
const PORT_TYPE_OUTPUT = 0;
export class View extends Context {
  @lazyInject(TYPES.RED) RED: IRED;
  space_width: any
  space_height: any
  lasso: any
  scaleFactor: any
  oldScaleFactor: any
  scrollTop: any;
  scrollLeft: any;
  outer: any;
  clipboard: any;
  vis: any;
  dragGroup: any;
  grid: any;
  snapGrid: any
  gridsize: number = 20;
  moving_set: any[] = [];
  workspaceScrollPositions: any = {};
  drag_lines: any[] = [];
  lastSelection: any = null;
  endMoveSet: boolean = false;
  portLabelHoverTimeout: any = null;
  portLabelHover: any = null;
  activeSubflow: any = null;
  activeNodes: any = [];
  activeLinks: any = [];
  activeFlowLinks: any = [];
  node_width = 100;
  mouse_mode = 0;
  mousedown_link = null;
  mousedown_node = null;
  node_height = 30;
  selected_link = null;
  mouse_position = null;
  mousedown_port_type = null;
  mousedown_port_index = 0;
  lineCurveScale: any;
  clickElapsed = 0;
  mouse_offset = [0, 0];
  mouseup_node: any = null;
  showStatus: any = false;
  lastClickNode: any = null;
  dblClickPrimed: any = null;
  clickTime = 0;
  activeSpliceLink: any;
  spliceActive = false;
  spliceTimer: any;
  outer_background: any;
  touchLongPressTimeout = 1000;
  startTouchDistance = 0;
  startTouchCenter = [];
  moveTouchCenter = [];
  touchStartTime: any = 0;
  constructor() {
    super({})
    // this.RED = ctx
    // console.log(ctx)
    // TODO: properties (ie. instance vars)
    var space_width = 5000,
      space_height = 5000,
      lineCurveScale = 0.75,
      scaleFactor = 1;



    var snapGrid = false;

    let instVars = {
      snapGrid,
      space_width,
      space_height,
      scaleFactor,
    }
    Object.keys(instVars).map(key => {
      this[key] = instVars[key]
    })

    let {
      canvasMouseMove,
      canvasMouseDown,
      canvasMouseUp
    } = this.rebind([
        'canvasMouseMove',
        'canvasMouseDown',
        'canvasMouseUp'
      ])

    this.clipboard = '';

    var status_colours = {
      'red': '#c00',
      'green': '#5a8',
      'yellow': '#F9DF31',
      'blue': '#53A3F3',
      'grey': '#d3d3d3'
    }


  }

  clearTimeout(timer) {
    clearTimeout(timer)
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
      handleD3MouseDownEvent,
      canvasMouseMove,
      canvasMouseDown,
      handleOuterTouchMoveEvent,
      touchStartTime,
      lasso,
      startTouchCenter,
      scaleFactor,
      startTouchDistance,
      touchLongPressTimeout,
      oldScaleFactor,
    } = this

    // handleOuterTouchStartEvent = handleOuterTouchStartEvent.bind(this)
    // handleOuterTouchEndEvent = handleOuterTouchEndEvent.bind(this)

    // TODO: use rebind?
    let {
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
      .on('mousedown', handleD3MouseDownEvent);

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
      .on('mousemove', canvasMouseMove)
      .on('mousedown', canvasMouseDown)
      .on('mouseup', canvasMouseUp)
    this.vis = vis


    vis
      .on('touchend', handleOuterTouchEndEvent(touchStartTime, lasso, canvasMouseUp))
      .on('touchcancel', canvasMouseUp)
      .on('touchstart', handleOuterTouchStartEvent(touchStartTime, startTouchCenter, scaleFactor, startTouchDistance, touchLongPressTimeout))
      .on('touchmove', handleOuterTouchMoveEvent(touchStartTime, startTouchCenter, lasso, canvasMouseMove, oldScaleFactor, scaleFactor, startTouchDistance));

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
    (<any>$('#chart')).droppable({
      accept: '.palette_node',
      drop: (event: any, ui: any) => {
        d3.event = event;
        var selected_tool = ui.draggable[0].type;
        var result = this.addNode(selected_tool, null, null);
        if (!result) {
          return;
        }
        var historyEvent: any = result.historyEvent;
        var nn: any = result.node;

        var helperOffset = d3.touches(ui.helper.get(0))[0] || d3.mouse(ui.helper.get(0));
        var mousePos: any = d3.touches(this)[0] || d3.mouse(this);

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

  updateGrid() {
    const {
      space_width,
      grid
    } = this    
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

  showDragLines(nodes) {
    const {
      drag_lines
    } = this
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      node.el = this.dragGroup.append('svg:path').attr('class', 'drag_line');
      drag_lines.push(node);
    }

  }

  hideDragLines() {
    const {
      drag_lines
    } = this
    while (drag_lines.length) {
      var line = drag_lines.pop();
      if (line.el) {
        line.el.remove();
      }
    }
  }

  updateActiveNodes() {
    var activeWorkspace = this.RED.workspaces.active();

    this.activeNodes = this.RED.nodes.filterNodes({
      z: activeWorkspace
    });

    this.activeLinks = this.RED.nodes.filterLinks({
      source: {
        z: activeWorkspace
      },
      target: {
        z: activeWorkspace
      }
    });
  }



  addNode(type: any, x: any, y: any) {

    var m = /^subflow:(.+)$/.exec(type);

    if (this.activeSubflow && m) {
      var subflowId = m[1];
      if (subflowId === this.activeSubflow.id) {
        this.RED.notify(this.RED._('notification.error', {
          message: this.RED._('notification.errors.cannotAddSubflowToItself')
        }), 'error');
        return;
      }
      if (this.RED.nodes.subflowContains(m[1], this.activeSubflow.id)) {
        this.RED.notify(this.RED._('notification.error', {
          message: this.RED._('notification.errors.cannotAddCircularReference')
        }), 'error');
        return;
      }
    }

    var nn: any = {
      id: this.RED.nodes.id(),
      z: this.RED.workspaces.active()
    };

    nn.type = type;
    nn._def = this.RED.nodes.getType(nn.type);

    if (!m) {
      nn.inputs = nn._def.inputs || 0;
      nn.outputs = nn._def.outputs;

      for (var d in nn._def.defaults) {
        if (nn._def.defaults.hasOwnProperty(d)) {
          if (nn._def.defaults[d].value !== undefined) {
            nn[d] = JSON.parse(JSON.stringify(nn._def.defaults[d].value));
          }
        }
      }

      if (nn._def.onadd) {
        try {
          nn._def.onadd.call(nn);
        } catch (err) {
          console.log('Definition error: ' + nn.type + '.onadd:', err);
        }
      }
    } else {
      var subflow = this.RED.nodes.subflow(m[1]);
      nn.inputs = subflow.in.length;
      nn.outputs = subflow.out.length;
    }

    nn.changed = true;
    nn.moved = true;

    nn.w = this.node_width;
    nn.h = Math.max(this.node_height, (nn.outputs || 0) * 15);

    var historyEvent: any = {
      t: 'add',
      nodes: [nn.id],
      dirty: this.RED.nodes.dirty()
    }
    if (this.activeSubflow) {
      var subflowRefresh = this.RED.subflow.refresh(true);
      if (subflowRefresh) {
        historyEvent.subflow = {
          id: this.activeSubflow.id,
          changed: this.activeSubflow.changed,
          instances: subflowRefresh.instances
        }
      }
    }
    return {
      node: nn,
      historyEvent: historyEvent
    }

  }

  canvasMouseDown() {
    const {
      mousedown_node,
      mousedown_link,
    } = this

    let {
      lasso
    } = this

    var point;

    if (!this.mousedown_node && !mousedown_link) {
      this.selected_link = null;
      this.updateSelection();
    }
    if (this.mouse_mode === 0) {
      if (lasso) {
        lasso.remove();
        lasso = null;
      }
    }
    if (this.mouse_mode === 0 || this.mouse_mode === this.RED.state.QUICK_JOINING) {
      if (d3.event.metaKey || d3.event.ctrlKey) {
        point = d3.mouse(this);
        d3.event.stopPropagation();
        var mainPos = $('#main-container').position();

        if (this.mouse_mode !== this.RED.state.QUICK_JOINING) {
          this.mouse_mode = this.RED.state.QUICK_JOINING;
          $(window).on('keyup', this.disableQuickJoinEventHandler);
        }

        this.RED.typeSearch.show({
          x: d3.event.clientX - mainPos.left - this.node_width / 2,
          y: d3.event.clientY - mainPos.top - this.node_height / 2,
          add: function (type) {
            var result = this.addNode(type);
            if (!result) {
              return;
            }
            var nn = result.node;
            var historyEvent = result.historyEvent;
            nn.x = point[0];
            nn.y = point[1];
            if (this.mouse_mode === this.RED.state.QUICK_JOINING) {
              if (this.drag_lines.length > 0) {
                var drag_line = this.drag_lines[0];
                var src = null,
                  dst, src_port;

                if (drag_line.portType === PORT_TYPE_OUTPUT && nn.inputs > 0) {
                  src = drag_line.node;
                  src_port = drag_line.port;
                  dst = nn;
                } else if (drag_line.portType === PORT_TYPE_INPUT && nn.outputs > 0) {
                  src = nn;
                  dst = drag_line.node;
                  src_port = 0;
                }
                if (src !== null) {
                  var link = {
                    source: src,
                    sourcePort: src_port,
                    target: dst
                  };
                  this.RED.nodes.addLink(link);
                  historyEvent.links = [link];
                  this.hideDragLines();
                  if (drag_line.portType === PORT_TYPE_OUTPUT && nn.outputs > 0) {
                    this.showDragLines([{
                      node: nn,
                      port: 0,
                      portType: PORT_TYPE_OUTPUT
                    }]);
                  } else if (drag_line.portType === PORT_TYPE_INPUT && nn.inputs > 0) {
                    this.showDragLines([{
                      node: nn,
                      port: 0,
                      portType: PORT_TYPE_INPUT
                    }]);
                  } else {
                    this.resetMouseVars();
                  }
                } else {
                  this.hideDragLines();
                  this.resetMouseVars();
                }
              } else {
                if (nn.outputs > 0) {
                  this.showDragLines([{
                    node: nn,
                    port: 0,
                    portType: PORT_TYPE_OUTPUT
                  }]);
                } else if (nn.inputs > 0) {
                  this.showDragLines([{
                    node: nn,
                    port: 0,
                    portType: PORT_TYPE_INPUT
                  }]);
                } else {
                  this.resetMouseVars();
                }
              }
            }


            this.RED.history.push(historyEvent);
            this.RED.nodes.add(nn);
            this.RED.editor.validateNode(nn);
            this.RED.nodes.dirty(true);
            // auto select dropped node - so info shows (if visible)
            this.clearSelection();
            nn.selected = true;
            this.moving_set.push({
              n: nn
            });
            this.updateActiveNodes();
            this.updateSelection();
            this.redraw();
          }
        });

        this.updateActiveNodes();
        this.updateSelection();
        this.redraw();
      }
    }
    if (this.mouse_mode === 0 && !(d3.event.metaKey || d3.event.ctrlKey)) {
      if (!this.touchStartTime) {
        point = d3.mouse(this);
        lasso = this.vis.append('rect')
          .attr('ox', point[0])
          .attr('oy', point[1])
          .attr('rx', 1)
          .attr('ry', 1)
          .attr('x', point[0])
          .attr('y', point[1])
          .attr('width', 0)
          .attr('height', 0)
          .attr('class', 'lasso');
        d3.event.preventDefault();
      }
    }
  }

  canvasMouseMove() {
    const {
      // methods
      resetMouseVars,
      redraw,
      showDragLines,
      updateActiveNodes
    } = this

    var i;
    var node;
    this.mouse_position = d3.touches(this)[0] || d3.mouse(this);
    // Prevent touch scrolling...
    //if (d3.touches(this)[0]) {
    //    d3.event.preventDefault();
    //}

    // TODO: auto scroll the container
    //var point = d3.mouse(this);
    //if (point[0]-container.scrollLeft < 30 && container.scrollLeft > 0) { container.scrollLeft -= 15; }
    //console.log(d3.mouse(this),container.offsetWidth,container.offsetHeight,container.scrollLeft,container.scrollTop);

    if (this.lasso) {
      var ox = parseInt(this.lasso.attr('ox'));
      var oy = parseInt(this.lasso.attr('oy'));
      var x = parseInt(this.lasso.attr('x'));
      var y = parseInt(this.lasso.attr('y'));
      var w;
      var h;
      if (this.mouse_position[0] < ox) {
        x = this.mouse_position[0];
        w = ox - x;
      } else {
        w = this.mouse_position[0] - x;
      }
      if (this.mouse_position[1] < oy) {
        y = this.mouse_position[1];
        h = oy - y;
      } else {
        h = this.mouse_position[1] - y;
      }
      this.lasso
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h);
      return;
    }

    if (this.mouse_mode != this.RED.state.QUICK_JOINING && this.mouse_mode != this.RED.state.IMPORT_DRAGGING && !this.mousedown_node && this.selected_link == null) {
      return;
    }

    var mousePos;
    if (this.mouse_mode == this.RED.state.JOINING || this.mouse_mode === this.RED.state.QUICK_JOINING) {
      // update drag line
      if (this.drag_lines.length === 0) {
        if (d3.event.shiftKey) {
          // Get all the wires we need to detach.
          var links = [];
          var existingLinks = [];
          if (this.selected_link &&
            ((this.mousedown_port_type === PORT_TYPE_OUTPUT &&
              this.selected_link.source === this.mousedown_node &&
              this.selected_link.sourcePort === this.mousedown_port_index
            ) ||
              (this.mousedown_port_type === PORT_TYPE_INPUT &&
                this.selected_link.target === this.mousedown_node
              ))
          ) {
            existingLinks = [this.selected_link];
          } else {
            var filter;
            if (this.mousedown_port_type === PORT_TYPE_OUTPUT) {
              filter = {
                source: this.mousedown_node,
                sourcePort: this.mousedown_port_index
              }
            } else {
              filter = {
                target: this.mousedown_node
              }
            }
            existingLinks = this.RED.nodes.filterLinks(filter);
          }
          for (i = 0; i < existingLinks.length; i++) {
            var link = existingLinks[i];
            this.RED.nodes.removeLink(link);
            links.push({
              link: link,
              node: (this.mousedown_port_type === PORT_TYPE_OUTPUT) ? link.target : link.source,
              port: (this.mousedown_port_type === PORT_TYPE_OUTPUT) ? 0 : link.sourcePort,
              portType: (this.mousedown_port_type === PORT_TYPE_OUTPUT) ? PORT_TYPE_INPUT : PORT_TYPE_OUTPUT
            })
          }
          if (links.length === 0) {
            resetMouseVars();
            redraw();
          } else {
            showDragLines(links);
            this.mouse_mode = 0;
            updateActiveNodes();
            redraw();
            this.mouse_mode = this.RED.state.JOINING;
          }
        } else if (this.mousedown_node) {
          showDragLines([{
            node: this.mousedown_node,
            port: this.mousedown_port_index,
            portType: this.mousedown_port_type
          }]);
        }
        this.selected_link = null;
      }
      mousePos = this.mouse_position;
      for (i = 0; i < this.drag_lines.length; i++) {
        var drag_line = this.drag_lines[i];
        var numOutputs = (drag_line.portType === PORT_TYPE_OUTPUT) ? (drag_line.node.outputs || 1) : 1;
        var sourcePort = drag_line.port;
        var portY = -((numOutputs - 1) / 2) * 13 + 13 * sourcePort;

        var sc = (drag_line.portType === PORT_TYPE_OUTPUT) ? 1 : -1;

        var dy = mousePos[1] - (drag_line.node.y + portY);
        var dx = mousePos[0] - (drag_line.node.x + sc * drag_line.node.w / 2);
        var delta = Math.sqrt(dy * dy + dx * dx);
        var scale = this.lineCurveScale;
        var scaleY = 0;

        if (delta < this.node_width) {
          scale = 0.75 - 0.75 * ((this.node_width - delta) / this.node_width);
        }
        if (dx * sc < 0) {
          scale += 2 * (Math.min(5 * this.node_width, Math.abs(dx)) / (5 * this.node_width));
          if (Math.abs(dy) < 3 * this.node_height) {
            scaleY = ((dy > 0) ? 0.5 : -0.5) * (((3 * this.node_height) - Math.abs(dy)) / (3 * this.node_height)) * (Math.min(this.node_width, Math.abs(dx)) / (this.node_width));
          }
        }

        drag_line.el.attr('d',
          'M ' + (drag_line.node.x + sc * drag_line.node.w / 2) + ' ' + (drag_line.node.y + portY) +
          ' C ' + (drag_line.node.x + sc * (drag_line.node.w / 2 + this.node_width * scale)) + ' ' + (drag_line.node.y + portY + scaleY * this.node_height) + ' ' +
          (mousePos[0] - sc * (scale) * this.node_width) + ' ' + (mousePos[1] - scaleY * this.node_height) + ' ' +
          mousePos[0] + ' ' + mousePos[1]
        );
      }
      d3.event.preventDefault();
    } else if (this.mouse_mode == this.RED.state.MOVING) {
      mousePos = d3.mouse(document.body);
      if (isNaN(mousePos[0])) {
        mousePos = d3.touches(document.body)[0];
      }
      var d = (this.mouse_offset[0] - mousePos[0]) * (this.mouse_offset[0] - mousePos[0]) + (this.mouse_offset[1] - mousePos[1]) * (this.mouse_offset[1] - mousePos[1]);
      if (d > 3) {
        this.mouse_mode = this.RED.state.MOVING_ACTIVE;
        this.clickElapsed = 0;
        this.spliceActive = false;
        if (this.moving_set.length === 1) {
          node = this.moving_set[0];
          this.spliceActive = node.n.hasOwnProperty('_def') &&
            node.n._def.inputs > 0 &&
            node.n._def.outputs > 0 &&
            this.RED.nodes.filterLinks({
              source: node.n
            }).length === 0 &&
            this.RED.nodes.filterLinks({
              target: node.n
            }).length === 0;
        }
      }
    } else if (this.mouse_mode == this.RED.state.MOVING_ACTIVE || this.mouse_mode == this.RED.state.IMPORT_DRAGGING) {
      mousePos = this.mouse_position;
      var minX = 0;
      var minY = 0;
      var maxX = this.space_width;
      var maxY = this.space_height;
      for (var n = 0; n < this.moving_set.length; n++) {
        node = this.moving_set[n];
        if (d3.event.shiftKey) {
          node.n.ox = node.n.x;
          node.n.oy = node.n.y;
        }
        node.n.x = mousePos[0] + node.dx;
        node.n.y = mousePos[1] + node.dy;
        node.n.dirty = true;
        minX = Math.min(node.n.x - node.n.w / 2 - 5, minX);
        minY = Math.min(node.n.y - node.n.h / 2 - 5, minY);
        maxX = Math.max(node.n.x + node.n.w / 2 + 5, maxX);
        maxY = Math.max(node.n.y + node.n.h / 2 + 5, maxY);
      }
      if (minX !== 0 || minY !== 0) {
        for (i = 0; i < this.moving_set.length; i++) {
          node = this.moving_set[i];
          node.n.x -= minX;
          node.n.y -= minY;
        }
      }
      if (maxX !== this.space_width || maxY !== this.space_height) {
        for (i = 0; i < this.moving_set.length; i++) {
          node = this.moving_set[i];
          node.n.x -= (maxX - this.space_width);
          node.n.y -= (maxY - this.space_height);
        }
      }
      if (this.snapGrid != d3.event.shiftKey && this.moving_set.length > 0) {
        var gridOffset = [0, 0];
        node = this.moving_set[0];
        gridOffset[0] = node.n.x - (this.gridsize * Math.floor((node.n.x - node.n.w / 2) / this.gridsize) + node.n.w / 2);
        gridOffset[1] = node.n.y - (this.gridsize * Math.floor(node.n.y / this.gridsize));
        if (gridOffset[0] !== 0 || gridOffset[1] !== 0) {
          for (i = 0; i < this.moving_set.length; i++) {
            node = this.moving_set[i];
            node.n.x -= gridOffset[0];
            node.n.y -= gridOffset[1];
            if (node.n.x == node.n.ox && node.n.y == node.n.oy) {
              node.dirty = false;
            }
          }
        }
      }
      if ((this.mouse_mode == this.RED.state.MOVING_ACTIVE || this.mouse_mode == this.RED.state.IMPORT_DRAGGING) && this.moving_set.length === 1) {
        node = this.moving_set[0];
        if (this.spliceActive) {
          if (!this.spliceTimer) {
            this.spliceTimer = setTimeout(function () {
              var nodes = [];
              var bestDistance = Infinity;
              var bestLink = null;
              var mouseX = node.n.x;
              var mouseY = node.n.y;
              if (this.outer[0][0].getIntersectionList) {
                var svgRect = this.outer[0][0].createSVGRect();
                svgRect.x = mouseX;
                svgRect.y = mouseY;
                svgRect.width = 1;
                svgRect.height = 1;
                nodes = this.outer[0][0].getIntersectionList(svgRect, this.outer[0][0]);
              } else {
                // Firefox doesn't do getIntersectionList and that
                // makes us sad
                nodes = this.RED.view.getLinksAtPoint(mouseX, mouseY);
              }
              for (var i = 0; i < nodes.length; i++) {
                if (d3.select(nodes[i]).classed('link_background')) {
                  var length = nodes[i].getTotalLength();
                  for (var j = 0; j < length; j += 10) {
                    var p = nodes[i].getPointAtLength(j);
                    var d2 = ((p.x - mouseX) * (p.x - mouseX)) + ((p.y - mouseY) * (p.y - mouseY));
                    if (d2 < 200 && d2 < bestDistance) {
                      bestDistance = d2;
                      bestLink = nodes[i];
                    }
                  }
                }
              }
              if (this.activeSpliceLink && this.activeSpliceLink !== bestLink) {
                d3.select(this.activeSpliceLink.parentNode).classed('link_splice', false);
              }
              if (bestLink) {
                d3.select(bestLink.parentNode).classed('link_splice', true)
              } else {
                d3.select('.link_splice').classed('link_splice', false);
              }
              this.activeSpliceLink = bestLink;
              this.spliceTimer = null;
            }, 100);
          }
        }
      }


    }
    if (this.mouse_mode !== 0) {
      redraw();
    }
  }

  canvasMouseUp() {
    var i;
    var historyEvent;
    if (this.mouse_mode === this.RED.state.QUICK_JOINING) {
      return;
    }
    if (this.mousedown_node && this.mouse_mode == this.RED.state.JOINING) {
      var removedLinks = [];
      for (i = 0; i < this.drag_lines.length; i++) {
        if (this.drag_lines[i].link) {
          removedLinks.push(this.drag_lines[i].link)
        }
      }
      historyEvent = {
        t: 'delete',
        links: removedLinks,
        dirty: this.RED.nodes.dirty()
      };
      this.RED.history.push(historyEvent);
      this.hideDragLines();
    }
    if (this.lasso) {
      var x = parseInt(this.lasso.attr('x'));
      var y = parseInt(this.lasso.attr('y'));
      var x2 = x + parseInt(this.lasso.attr('width'));
      var y2 = y + parseInt(this.lasso.attr('height'));
      if (!d3.event.ctrlKey) {
        this.clearSelection();
      }
      this.RED.nodes.eachNode(function (n) {
        if (n.z == this.RED.workspaces.active() && !n.selected) {
          n.selected = (n.x > x && n.x < x2 && n.y > y && n.y < y2);
          if (n.selected) {
            n.dirty = true;
            this.moving_set.push({
              n: n
            });
          }
        }
      });
      if (this.activeSubflow) {
        this.activeSubflow.in.forEach(function (n) {
          n.selected = (n.x > x && n.x < x2 && n.y > y && n.y < y2);
          if (n.selected) {
            n.dirty = true;
            this.moving_set.push({
              n: n
            });
          }
        });
        this.activeSubflow.out.forEach(function (n) {
          n.selected = (n.x > x && n.x < x2 && n.y > y && n.y < y2);
          if (n.selected) {
            n.dirty = true;
            this.moving_set.push({
              n: n
            });
          }
        });
      }
      this.updateSelection();
      this.lasso.remove();
      this.lasso = null;
    } else if (this.mouse_mode == this.RED.state.DEFAULT && this.mousedown_link == null && !d3.event.ctrlKey && !d3.event.metaKey) {
      this.clearSelection();
      this.updateSelection();
    }
    if (this.mouse_mode == this.RED.state.MOVING_ACTIVE) {
      if (this.moving_set.length > 0) {
        var ns = [];
        for (var j = 0; j < this.moving_set.length; j++) {
          var n = this.moving_set[j];
          if (n.ox !== n.n.x || n.oy !== n.n.y) {
            ns.push({
              n: n.n,
              ox: n.ox,
              oy: n.oy,
              moved: n.n.moved
            });
            n.n.dirty = true;
            n.n.moved = true;
          }
        }
        if (ns.length > 0) {
          historyEvent = {
            t: 'move',
            nodes: ns,
            dirty: this.RED.nodes.dirty()
          };
          if (this.activeSpliceLink) {
            // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
            var spliceLink = d3.select(this.activeSpliceLink).data()[0];
            this.RED.nodes.removeLink(spliceLink);
            var link1 = {
              source: spliceLink.source,
              sourcePort: spliceLink.sourcePort,
              target: this.moving_set[0].n
            };
            var link2 = {
              source: this.moving_set[0].n,
              sourcePort: 0,
              target: spliceLink.target
            };
            this.RED.nodes.addLink(link1);
            this.RED.nodes.addLink(link2);
            historyEvent.links = [link1, link2];
            historyEvent.removedLinks = [spliceLink];
            this.updateActiveNodes();
          }
          this.RED.nodes.dirty(true);
          this.RED.history.push(historyEvent);
        }
      }
    }
    if (this.mouse_mode == this.RED.state.MOVING || this.mouse_mode == this.RED.state.MOVING_ACTIVE) {
      for (i = 0; i < this.moving_set.length; i++) {
        delete this.moving_set[i].ox;
        delete this.moving_set[i].oy;
      }
    }
    if (this.mouse_mode == this.RED.state.IMPORT_DRAGGING) {
      this.RED.keyboard.remove('escape');
      this.updateActiveNodes();
      this.RED.nodes.dirty(true);
    }
    this.resetMouseVars();
    this.redraw();
  }

  zoomIn() {
    if (this.scaleFactor < 2) {
      this.scaleFactor += 0.1;
      this.redraw();
    }
  }

  zoomOut() {
    if (this.scaleFactor > 0.3) {
      this.scaleFactor -= 0.1;
      this.redraw();
    }
  }

  zoomZero() {
    this.scaleFactor = 1;
    this.redraw();
  }

  selectAll() {
    this.RED.nodes.eachNode(function (n) {
      if (n.z == this.RED.workspaces.active()) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          this.moving_set.push({
            n: n
          });
        }
      }
    });
    if (this.activeSubflow) {
      this.activeSubflow.in.forEach(function (n) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          this.moving_set.push({
            n: n
          });
        }
      });
      this.activeSubflow.out.forEach(function (n) {
        if (!n.selected) {
          n.selected = true;
          n.dirty = true;
          this.moving_set.push({
            n: n
          });
        }
      });
    }

    this.selected_link = null;
    this.updateSelection();
    this.redraw();
  }

  clearSelection() {
    for (var i = 0; i < this.moving_set.length; i++) {
      var n = this.moving_set[i];
      n.n.dirty = true;
      n.n.selected = false;
    }
    this.moving_set = [];
    this.selected_link = null;
  }

  updateSelection() {
    var selection: any = {};

    if (this.moving_set.length > 0) {
      selection.nodes = this.moving_set.map(function (n) {
        return n.n;
      });
    }
    if (this.selected_link != null) {
      selection.link = this.selected_link;
    }
    var activeWorkspace = this.RED.workspaces.active();
    this.activeLinks = this.RED.nodes.filterLinks({
      source: {
        z: activeWorkspace
      },
      target: {
        z: activeWorkspace
      }
    });
    var tabOrder = this.RED.nodes.getWorkspaceOrder();
    var currentLinks = this.activeLinks;
    var addedLinkLinks = {};
    this.activeFlowLinks = [];
    for (var i = 0; i < this.moving_set.length; i++) {
      if (this.moving_set[i].n.type === 'link out' || this.moving_set[i].n.type === 'link in') {
        var linkNode = this.moving_set[i].n;
        var offFlowLinks = {};
        linkNode.links.forEach(function (id) {
          var target = this.RED.nodes.node(id);
          if (target) {
            if (linkNode.type === 'link out') {
              if (target.z === linkNode.z) {
                if (!addedLinkLinks[linkNode.id + ':' + target.id]) {
                  this.activeLinks.push({
                    source: linkNode,
                    sourcePort: 0,
                    target: target,
                    link: true
                  });
                  addedLinkLinks[linkNode.id + ':' + target.id] = true;
                }
              } else {
                offFlowLinks[target.z] = offFlowLinks[target.z] || [];
                offFlowLinks[target.z].push(target);
              }
            } else {
              if (target.z === linkNode.z) {
                if (!addedLinkLinks[target.id + ':' + linkNode.id]) {
                  this.activeLinks.push({
                    source: target,
                    sourcePort: 0,
                    target: linkNode,
                    link: true
                  });
                  addedLinkLinks[target.id + ':' + linkNode.id] = true;
                }
              } else {
                offFlowLinks[target.z] = offFlowLinks[target.z] || [];
                offFlowLinks[target.z].push(target);
              }
            }
          }
        });
        var offFlows = Object.keys(offFlowLinks);
        // offFlows.sort(function(A,B) {
        //     return tabOrder.indexOf(A) - tabOrder.indexOf(B);
        // });
        if (offFlows.length > 0) {
          this.activeFlowLinks.push({
            refresh: Math.floor(Math.random() * 10000),
            node: linkNode,
            links: offFlowLinks //offFlows.map(function(i) { return {id:i,links:offFlowLinks[i]};})
          });
        }
      }
    }

    var selectionJSON = activeWorkspace + ':' + JSON.stringify(selection, function (key, value) {
      if (key === 'nodes') {
        return value.map(function (n) {
          return n.id
        })
      } else if (key === 'link') {
        return value.source.id + ':' + value.sourcePort + ':' + value.target.id;
      }
      return value;
    });
    if (selectionJSON !== this.lastSelection) {
      this.lastSelection = selectionJSON;
      this.RED.events.emit('view:selection-changed', selection);
    }
  }

  endKeyboardMove() {
    this.endMoveSet = false;
    if (this.moving_set.length > 0) {
      var ns = [];
      for (var i = 0; i < this.moving_set.length; i++) {
        ns.push({
          n: this.moving_set[i].n,
          ox: this.moving_set[i].ox,
          oy: this.moving_set[i].oy,
          moved: this.moving_set[i].n.moved
        });
        this.moving_set[i].n.moved = true;
        this.moving_set[i].n.dirty = true;
        delete this.moving_set[i].ox;
        delete this.moving_set[i].oy;
      }
      this.redraw();
      this.RED.history.push({
        t: 'move',
        nodes: ns,
        dirty: this.RED.nodes.dirty()
      });
      this.RED.nodes.dirty(true);
    }
  }


  moveSelection(dx, dy) {
    if (this.moving_set.length > 0) {
      if (!this.endMoveSet) {
        $(document).one('keyup', this.endKeyboardMove);
        this.endMoveSet = true;
      }
      var minX = 0;
      var minY = 0;
      var node;

      for (var i = 0; i < this.moving_set.length; i++) {
        node = this.moving_set[i];
        node.n.moved = true;
        node.n.dirty = true;
        if (node.ox == null && node.oy == null) {
          node.ox = node.n.x;
          node.oy = node.n.y;
        }
        node.n.x += dx;
        node.n.y += dy;
        node.n.dirty = true;
        minX = Math.min(node.n.x - node.n.w / 2 - 5, minX);
        minY = Math.min(node.n.y - node.n.h / 2 - 5, minY);
      }

      if (minX !== 0 || minY !== 0) {
        for (var n = 0; n < this.moving_set.length; n++) {
          node = this.moving_set[n];
          node.n.x -= minX;
          node.n.y -= minY;
        }
      }

      this.redraw();
    }
  }

  editSelection() {
    if (this.moving_set.length > 0) {
      var node = this.moving_set[0].n;
      if (node.type === 'subflow') {
        this.RED.editor.editSubflow(this.activeSubflow);
      } else {
        this.RED.editor.edit(node);
      }
    }
  }

  deleteSelection() {
    if (this.moving_set.length > 0 || this.selected_link != null) {
      var result;
      var removedNodes = [];
      var removedLinks = [];
      var removedSubflowOutputs = [];
      var removedSubflowInputs = [];
      var subflowInstances = [];

      var startDirty = this.RED.nodes.dirty();
      var startChanged = false;
      if (this.moving_set.length > 0) {
        for (var i = 0; i < this.moving_set.length; i++) {
          var node = this.moving_set[i].n;
          node.selected = false;
          if (node.type != 'subflow') {
            if (node.x < 0) {
              node.x = 25
            }
            var removedEntities = this.RED.nodes.remove(node.id);
            removedNodes.push(node);
            removedNodes = removedNodes.concat(removedEntities.nodes);
            removedLinks = removedLinks.concat(removedEntities.links);
          } else {
            if (node.direction === 'out') {
              removedSubflowOutputs.push(node);
            } else if (node.direction === 'in') {
              removedSubflowInputs.push(node);
            }
            node.dirty = true;
          }
        }
        if (removedSubflowOutputs.length > 0) {
          result = this.RED.subflow.removeOutput(removedSubflowOutputs);
          if (result) {
            removedLinks = removedLinks.concat(result.links);
          }
        }
        // Assume 0/1 inputs
        if (removedSubflowInputs.length == 1) {
          result = this.RED.subflow.removeInput();
          if (result) {
            removedLinks = removedLinks.concat(result.links);
          }
        }
        var instances = this.RED.subflow.refresh(true);
        if (instances) {
          subflowInstances = instances.instances;
        }
        this.moving_set = [];
        if (removedNodes.length > 0 || removedSubflowOutputs.length > 0 || removedSubflowInputs.length > 0) {
          this.RED.nodes.dirty(true);
        }
      }
      if (this.selected_link) {
        this.RED.nodes.removeLink(this.selected_link);
        removedLinks.push(this.selected_link);
        this.RED.nodes.dirty(true);
      }
      var historyEvent = {
        t: 'delete',
        nodes: removedNodes,
        links: removedLinks,
        subflowOutputs: removedSubflowOutputs,
        subflowInputs: removedSubflowInputs,
        subflow: {
          instances: subflowInstances
        },
        dirty: startDirty
      };
      this.RED.history.push(historyEvent);

      this.selected_link = null;
      this.updateActiveNodes();
      this.updateSelection();
      this.redraw();
    }
  }

  copySelection() {
    if (this.moving_set.length > 0) {
      var nns = [];
      for (var n = 0; n < this.moving_set.length; n++) {
        var node = this.moving_set[n].n;
        // The only time a node.type == subflow can be selected is the
        // input/output 'proxy' nodes. They cannot be copied.
        if (node.type != 'subflow') {
          for (var d in node._def.defaults) {
            if (node._def.defaults.hasOwnProperty(d)) {
              if (node._def.defaults[d].type) {
                var configNode = this.RED.nodes.node(node[d]);
                if (configNode && configNode._def.exclusive) {
                  nns.push(this.RED.nodes.convertNode(configNode));
                }
              }
            }
          }
          nns.push(this.RED.nodes.convertNode(node));
          //TODO: if the node has an exclusive config node, it should also be copied, to ensure it remains exclusive...
        }
      }
      this.clipboard = JSON.stringify(nns);
      this.RED.notify(this.RED._('clipboard.nodeCopied', {
        count: nns.length
      }), null);
    }
  }


  calculateTextWidth(str, className, offset) {
    return this.calculateTextDimensions(str, className, offset, 0)[0];
  }

  calculateTextDimensions(str, className, offsetW, offsetH) {
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

  resetMouseVars() {
    const {
      clearTimeout
    } = this


    this.mousedown_node = null;
    this.mouseup_node = null;
    this.mousedown_link = null;
    this.mouse_mode = 0;
    this.mousedown_port_type = PORT_TYPE_OUTPUT;
    this.activeSpliceLink = null;
    this.spliceActive = false;
    d3.select('.link_splice').classed('link_splice', false);
    if (this.spliceTimer) {
      clearTimeout(this.spliceTimer);
      this.spliceTimer = null;
    }
  }

  disableQuickJoinEventHandler(evt) {
    const {
      disableQuickJoinEventHandler
    } = this
    // Check for ctrl (all browsers), 'Meta' (Chrome/FF), keyCode 91 (Safari)
    if (evt.keyCode === 17 || evt.key === 'Meta' || evt.keyCode === 91) {
      this.resetMouseVars();
      this.hideDragLines();
      this.redraw();
      $(window).off('keyup', disableQuickJoinEventHandler);
    }
  }

  portMouseDown(d, portType, portIndex) {
    const {
      // methods
      showDragLines
    } = this
    let {
      mouse_mode,
      mousedown_node,
      mousedown_port_type,
      mousedown_port_index
    } = this

    //console.log(d,portType,portIndex);
    // disable zoom
    //vis.call(d3.behavior.zoom().on('zoom'), null);
    mousedown_node = d;
    mousedown_port_type = portType;
    mousedown_port_index = portIndex || 0;
    if (mouse_mode !== this.RED.state.QUICK_JOINING) {
      mouse_mode = this.RED.state.JOINING;
      document.body.style.cursor = 'crosshair';
      if (d3.event.ctrlKey || d3.event.metaKey) {
        mouse_mode = this.RED.state.QUICK_JOINING;
        showDragLines([{
          node: mousedown_node,
          port: mousedown_port_index,
          portType: mousedown_port_type
        }]);
        $(window).on('keyup', this.disableQuickJoinEventHandler);
      }
    }
    d3.event.stopPropagation();
    d3.event.preventDefault();
  }

  portMouseUp(d, portType, portIndex) {
    const {
      mouse_mode
    } = this
    var i;
    if (mouse_mode === this.RED.state.QUICK_JOINING) {
      if (this.drag_lines[0].node === d) {
        return
      }
    }
    document.body.style.cursor = '';
    if (mouse_mode == this.RED.state.JOINING || mouse_mode == this.RED.state.QUICK_JOINING) {
      if (typeof TouchEvent != 'undefined' && d3.event instanceof TouchEvent) {
        this.RED.nodes.eachNode(function (n) {
          if (n.z == this.RED.workspaces.active()) {
            var hw = n.w / 2;
            var hh = n.h / 2;
            if (n.x - hw < this.mouse_position[0] && n.x + hw > this.mouse_position[0] &&
              n.y - hh < this.mouse_position[1] && n.y + hh > this.mouse_position[1]) {
              this.mouseup_node = n;
              portType = this.mouseup_node.inputs > 0 ? PORT_TYPE_INPUT : PORT_TYPE_OUTPUT;
              portIndex = 0;
            }
          }
        });
      } else {
        this.mouseup_node = d;
      }
      var addedLinks = [];
      var removedLinks = [];

      for (i = 0; i < this.drag_lines.length; i++) {
        if (this.drag_lines[i].link) {
          removedLinks.push(this.drag_lines[i].link)
        }
      }
      for (i = 0; i < this.drag_lines.length; i++) {
        if (portType != this.drag_lines[i].portType && this.mouseup_node !== this.drag_lines[i].node) {
          var drag_line = this.drag_lines[i];
          var src, dst, src_port;
          if (drag_line.portType === PORT_TYPE_OUTPUT) {
            src = drag_line.node;
            src_port = drag_line.port;
            dst = this.mouseup_node;
          } else if (drag_line.portType === PORT_TYPE_INPUT) {
            src = this.mouseup_node;
            dst = drag_line.node;
            src_port = portIndex;
          }
          var existingLink = this.RED.nodes.filterLinks({
            source: src,
            target: dst,
            sourcePort: src_port
          }).length !== 0;
          if (!existingLink) {
            var link = {
              source: src,
              sourcePort: src_port,
              target: dst
            };
            this.RED.nodes.addLink(link);
            addedLinks.push(link);
          }
        }
      }
      if (addedLinks.length > 0 || removedLinks.length > 0) {
        var historyEvent: any = {
          t: 'add',
          links: addedLinks,
          removedLinks: removedLinks,
          dirty: this.RED.nodes.dirty()
        };
        if (this.activeSubflow) {
          var subflowRefresh = this.RED.subflow.refresh(true);
          if (subflowRefresh) {
            historyEvent.subflow = {
              id: this.activeSubflow.id,
              changed: this.activeSubflow.changed,
              instances: subflowRefresh.instances
            }
          }
        }
        this.RED.history.push(historyEvent);
        this.updateActiveNodes();
        this.RED.nodes.dirty(true);
      }
      if (mouse_mode === this.RED.state.QUICK_JOINING) {
        if (addedLinks.length > 0) {
          this.hideDragLines();
          if (portType === PORT_TYPE_INPUT && d.outputs > 0) {
            this.showDragLines([{
              node: d,
              port: 0,
              portType: PORT_TYPE_OUTPUT
            }]);
          } else if (portType === PORT_TYPE_OUTPUT && d.inputs > 0) {
            this.showDragLines([{
              node: d,
              port: 0,
              portType: PORT_TYPE_INPUT
            }]);
          } else {
            this.resetMouseVars();
          }
        }
        this.redraw();
        return;
      }

      this.resetMouseVars();
      this.hideDragLines();
      this.selected_link = null;
      this.redraw();
    }
  }

  getElementPosition(node) {
    var d3Node = d3.select(node);
    if (d3Node.attr('class') === 'innerCanvas') {
      return [0, 0];
    }
    var result = [];
    var localPos = [0, 0];
    if (node.nodeName.toLowerCase() === 'g') {
      var transform = d3Node.attr('transform');
      if (transform) {
        localPos = d3.transform(transform).translate;
      }
    } else {
      localPos = [d3Node.attr('x') || 0, d3Node.attr('y') || 0];
    }
    var parentPos = this.getElementPosition(node.parentNode);
    return [localPos[0] + parentPos[0], localPos[1] + parentPos[1]]

  }

  getPortLabel(node, portType, portIndex) {
    var result;
    var nodePortLabels = (portType === PORT_TYPE_INPUT) ? node.inputLabels : node.outputLabels;
    if (nodePortLabels && nodePortLabels[portIndex]) {
      return nodePortLabels[portIndex];
    }
    var portLabels = (portType === PORT_TYPE_INPUT) ? node._def.inputLabels : node._def.outputLabels;
    if (typeof portLabels === 'string') {
      result = portLabels;
    } else if (typeof portLabels === 'function') {
      try {
        result = portLabels.call(node, portIndex);
      } catch (err) {
        console.log('Definition error: ' + node.type + '.' + ((portType === PORT_TYPE_INPUT) ? 'inputLabels' : 'outputLabels'), err);
        result = null;
      }
    } else if ($.isArray(portLabels)) {
      result = portLabels[portIndex];
    }
    return result;
  }

  portMouseOver(port, d, portType, portIndex) {
    clearTimeout(this.portLabelHoverTimeout);
    var active = (this.mouse_mode != this.RED.state.JOINING || (this.drag_lines.length > 0 && this.drag_lines[0].portType !== portType));
    if (active && ((portType === PORT_TYPE_INPUT && ((d._def && d._def.inputLabels) || d.inputLabels)) || (portType === PORT_TYPE_OUTPUT && ((d._def && d._def.outputLabels) || d.outputLabels)))) {
      this.portLabelHoverTimeout = setTimeout(function () {
        var tooltip = this.getPortLabel(d, portType, portIndex);
        if (!tooltip) {
          return;
        }
        var pos = this.getElementPosition(port.node());
        this.portLabelHoverTimeout = null;
        this.portLabelHover = this.vis.append('g')
          .attr('transform', 'translate(' + (pos[0] + (portType === PORT_TYPE_INPUT ? -2 : 12)) + ',' + (pos[1] + 5) + ')')
          .attr('class', 'port_tooltip');
        var lines = tooltip.split('\n');
        var labelWidth = 0;
        var labelHeight = 4;
        var labelHeights = [];
        lines.forEach(function (l) {
          var labelDimensions = this.calculateTextDimensions(l, 'port_tooltip_label', 8, 0);
          labelWidth = Math.max(labelWidth, labelDimensions[0]);
          labelHeights.push(0.8 * labelDimensions[1]);
          labelHeight += 0.8 * labelDimensions[1];
        });

        var labelHeight1 = (labelHeight / 2) - 5 - 2;
        var labelHeight2 = labelHeight - 4;
        this.portLabelHover.append('path').attr('d',
          portType === PORT_TYPE_INPUT ?
            'M0 0 l -5 -5 v -' + (labelHeight1) + ' q 0 -2 -2 -2 h -' + labelWidth + ' q -2 0 -2 2 v ' + (labelHeight2) + ' q 0 2 2 2 h ' + labelWidth + ' q 2 0 2 -2 v -' + (labelHeight1) + ' l 5 -5' :
            'M0 0 l 5 -5 v -' + (labelHeight1) + ' q 0 -2 2 -2 h ' + labelWidth + ' q 2 0 2 2 v ' + (labelHeight2) + ' q 0 2 -2 2 h -' + labelWidth + ' q -2 0 -2 -2 v -' + (labelHeight1) + ' l -5 -5'
        );
        var y = -labelHeight / 2 - 2;
        lines.forEach(function (l, i) {
          y += labelHeights[i];
          this.portLabelHover.append('svg:text').attr('class', 'port_tooltip_label')
            .attr('x', portType === PORT_TYPE_INPUT ? -10 : 10)
            .attr('y', y)
            .attr('text-anchor', portType === PORT_TYPE_INPUT ? 'end' : 'start')
            .text(l)
        });
      }, 500);
    }
    port.classed('port_hovered', active);
  }

  portMouseOut(port, d, portType, portIndex) {
    const {
      clearTimeout
    } = this

    clearTimeout(this.portLabelHoverTimeout);
    if (this.portLabelHover) {
      this.portLabelHover.remove();
      this.portLabelHover = null;
    }
    port.classed('port_hovered', false);
  }

  nodeMouseUp(d) {
    if (this.dblClickPrimed && this.mousedown_node == d && this.clickElapsed > 0 && this.clickElapsed < 750) {
      this.mouse_mode = this.RED.state.DEFAULT;
      if (d.type != 'subflow') {
        this.RED.editor.edit(d);
      } else {
        this.RED.editor.editSubflow(this.activeSubflow);
      }
      this.clickElapsed = 0;
      d3.event.stopPropagation();
      return;
    }
    var direction = d._def ? (d.inputs > 0 ? 1 : 0) : (d.direction == 'in' ? 0 : 1)
    this.portMouseUp(d, direction, 0);
  }

  nodeMouseDown(d) {
    this.focusView();
    //var touch0 = d3.event;
    //var pos = [touch0.pageX,touch0.pageY];
    //this.RED.touch.radialMenu.show(d3.select(this),pos);
    if (this.mouse_mode == this.RED.state.IMPORT_DRAGGING) {
      this.RED.keyboard.remove('escape');

      if (this.activeSpliceLink) {
        // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
        var spliceLink = d3.select(this.activeSpliceLink).data()[0];
        this.RED.nodes.removeLink(spliceLink);
        var link1 = {
          source: spliceLink.source,
          sourcePort: spliceLink.sourcePort,
          target: this.moving_set[0].n
        };
        var link2 = {
          source: this.moving_set[0].n,
          sourcePort: 0,
          target: spliceLink.target
        };
        this.RED.nodes.addLink(link1);
        this.RED.nodes.addLink(link2);
        var historyEvent = this.RED.history.peek();
        historyEvent.links = [link1, link2];
        historyEvent.removedLinks = [spliceLink];
        this.updateActiveNodes();
      }

      this.updateSelection();
      this.RED.nodes.dirty(true);
      this.redraw();
      this.resetMouseVars();
      d3.event.stopPropagation();
      return;
    } else if (this.mouse_mode == this.RED.state.QUICK_JOINING) {
      d3.event.stopPropagation();
      return;
    }
    this.mousedown_node = d;
    var now = Date.now();
    this.clickElapsed = now - this.clickTime;
    this.clickTime = now;

    this.dblClickPrimed = (this.lastClickNode == this.mousedown_node);
    this.lastClickNode = this.mousedown_node;

    var i;

    if (d.selected && (d3.event.ctrlKey || d3.event.metaKey)) {
      this.mousedown_node.selected = false;
      for (i = 0; i < this.moving_set.length; i += 1) {
        if (this.moving_set[i].n === this.mousedown_node) {
          this.moving_set.splice(i, 1);
          break;
        }
      }
    } else {
      if (d3.event.shiftKey) {
        this.clearSelection();
        var cnodes = this.RED.nodes.getAllFlowNodes(this.mousedown_node);
        for (var n = 0; n < cnodes.length; n++) {
          cnodes[n].selected = true;
          cnodes[n].dirty = true;
          this.moving_set.push({
            n: cnodes[n]
          });
        }
      } else if (!d.selected) {
        if (!d3.event.ctrlKey && !d3.event.metaKey) {
          this.clearSelection();
        }
        this.mousedown_node.selected = true;
        this.moving_set.push({
          n: this.mousedown_node
        });
      }
      this.selected_link = null;
      if (d3.event.button != 2) {
        this.mouse_mode = this.RED.state.MOVING;
        var mouse = d3.touches(this)[0] || d3.mouse(this);
        mouse[0] += d.x - d.w / 2;
        mouse[1] += d.y - d.h / 2;
        for (i = 0; i < this.moving_set.length; i++) {
          this.moving_set[i].ox = this.moving_set[i].n.x;
          this.moving_set[i].oy = this.moving_set[i].n.y;
          this.moving_set[i].dx = this.moving_set[i].n.x - mouse[0];
          this.moving_set[i].dy = this.moving_set[i].n.y - mouse[1];
        }
        this.mouse_offset = d3.mouse(document.body);
        if (isNaN(this.mouse_offset[0])) {
          this.mouse_offset = d3.touches(document.body)[0];
        }
      }
    }
    d.dirty = true;
    this.updateSelection();
    this.redraw();
    d3.event.stopPropagation();
  }

  isButtonEnabled(d) {
    var buttonEnabled = true;
    if (d._def.button.hasOwnProperty('enabled')) {
      if (typeof d._def.button.enabled === 'function') {
        buttonEnabled = d._def.button.enabled.call(d);
      } else {
        buttonEnabled = d._def.button.enabled;
      }
    }
    return buttonEnabled;
  }

  nodeButtonClicked(d) {
    const {
      activeSubflow,
      redraw
    } = this

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

  showTouchMenu(obj, pos) {
    const {
      mousedown_node,
      moving_set,
      clipboard,
      selected_link,

      // methods
      deleteSelection,
      copySelection,
      importNodes,
      selectAll,
      resetMouseVars,
    } = this

    var mdn = mousedown_node;
    var options = [];
    options.push({
      name: 'delete',
      disabled: (moving_set.length === 0 && selected_link === null),
      onselect: () => {
        deleteSelection();
      }
    });
    options.push({
      name: 'cut',
      disabled: (moving_set.length === 0),
      onselect: () => {
        copySelection();
        deleteSelection();
      }
    });
    options.push({
      name: 'copy',
      disabled: (moving_set.length === 0),
      onselect: () => {
        copySelection();
      }
    });
    options.push({
      name: 'paste',
      disabled: (clipboard.length === 0),
      onselect: () => {
        importNodes(clipboard, false, true);
      }
    });
    options.push({
      name: 'edit',
      disabled: (moving_set.length != 1),
      onselect: () => {
        this.RED.editor.edit(mdn);
      }
    });
    options.push({
      name: 'select',
      onselect: () => {
        selectAll();
      }
    });
    options.push({
      name: 'undo',
      disabled: (this.RED.history.depth() === 0),
      onselect: () => {
        this.RED.history.pop();
      }
    });

    this.RED.touch.radialMenu.show(obj, pos, options);
    resetMouseVars();
    return this
  }

  redraw(updateActive?) {
    const {
      updateActiveNodes,
      updateSelection,
      vis,
      outer,
      mouse_mode,
      scaleFactor,
      space_width,
      space_height,
      activeSubflow,
      activeNodes,
      activeLinks,
      activeFlowLinks
    } = this

    if (updateActive) {
      updateActiveNodes();
      updateSelection();
    }

    if (!vis) {
      this.handleError('redraw: vis not yet defined', {
        vis,
        view: this
      })
    }

    vis.attr('transform', 'scale(' + scaleFactor + ')');

    if (!outer) {
      this.handleError('redraw: outer not yet defined', {
        outer,
        view: this
      })
    }

    outer
      .attr('width', space_width * scaleFactor)
      .attr('height', space_height * scaleFactor);

    // Don't bother redrawing nodes if we're drawing links
    if (mouse_mode != this.RED.state.JOINING) {

      var dirtyNodes = {};

      if (activeSubflow) {
        var subflowOutputs = vis.selectAll('.subflowoutput').data(activeSubflow.out, (d, i) => {
          return d.id;
        });
        subflowOutputs.exit().remove();
        var outGroup = subflowOutputs.enter().insert('svg:g').attr('class', 'node subflowoutput').attr('transform', (d) => {
          return 'translate(' + (d.x - 20) + ',' + (d.y - 20) + ')'
        });
        outGroup.each(function (d, i) {
          d.w = 40;
          d.h = 40;
        });
        outGroup.append('rect').attr('class', 'subflowport').attr('rx', 8).attr('ry', 8).attr('width', 40).attr('height', 40)
          // TODO: This is exactly the same set of handlers used for regular nodes - DRY
          .on('mouseup', this.nodeMouseUp)
          .on('mousedown', this.nodeMouseDown)
          .on('touchstart', (d) => {
            var obj = d3.select(this);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.startTouchCenter = [touch0.pageX, touch0.pageY];
            this.startTouchDistance = 0;
            this.touchStartTime = setTimeout(function () {
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
            this.nodeMouseDown.call(this, d)
          })
          .on('touchend', (d) => {
            clearTimeout(this.touchStartTime);
            this.touchStartTime = null;
            if (this.RED.touch.radialMenu.active()) {
              d3.event.stopPropagation();
              return;
            }
            this.nodeMouseUp.call(this, d);
          });

        outGroup.append('g').attr('transform', 'translate(-5,15)').append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
          .on('mousedown', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_INPUT, 0);
          })
          .on('touchstart', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_INPUT, 0);
          })
          .on('mouseup', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_INPUT, 0);
          })
          .on('touchend', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_INPUT, 0);
          })
          .on('mouseover', function (d) {
            this.portMouseOver(d3.select(this), d, PORT_TYPE_INPUT, 0);
          })
          .on('mouseout', function (d) {
            this.portMouseOut(d3.select(this), d, PORT_TYPE_INPUT, 0);
          });

        outGroup.append('svg:text').attr('class', 'port_label').attr('x', 20).attr('y', 8).style('font-size', '10px').text('output');
        outGroup.append('svg:text').attr('class', 'port_label port_index').attr('x', 20).attr('y', 24).text(function (d, i) {
          return i + 1
        });

        var subflowInputs = vis.selectAll('.subflowinput').data(activeSubflow.in, function (d, i) {
          return d.id;
        });
        subflowInputs.exit().remove();
        var inGroup = subflowInputs.enter().insert('svg:g').attr('class', 'node subflowinput').attr('transform', function (d) {
          return 'translate(' + (d.x - 20) + ',' + (d.y - 20) + ')'
        });
        inGroup.each(function (d, i) {
          d.w = 40;
          d.h = 40;
        });
        inGroup.append('rect').attr('class', 'subflowport').attr('rx', 8).attr('ry', 8).attr('width', 40).attr('height', 40)
          // TODO: This is exactly the same set of handlers used for regular nodes - DRY
          .on('mouseup', this.nodeMouseUp)
          .on('mousedown', this.nodeMouseDown)
          .on('touchstart', function (d) {
            var obj = d3.select(this);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.startTouchCenter = [touch0.pageX, touch0.pageY];
            this.startTouchDistance = 0;
            this.touchStartTime = setTimeout(function () {
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
            this.nodeMouseDown.call(this, d)
          })
          .on('touchend', function (d) {
            clearTimeout(this.touchStartTime);
            this.touchStartTime = null;
            if (this.RED.touch.radialMenu.active()) {
              d3.event.stopPropagation();
              return;
            }
            this.nodeMouseUp.call(this, d);
          });

        inGroup.append('g').attr('transform', 'translate(35,15)').append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
          .on('mousedown', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_OUTPUT, i);
          })
          .on('touchstart', function (d, i) {
            this.portMouseDown(d, PORT_TYPE_OUTPUT, i);
          })
          .on('mouseup', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_OUTPUT, i);
          })
          .on('touchend', function (d, i) {
            this.portMouseUp(d, PORT_TYPE_OUTPUT, i);
          })
          .on('mouseover', function (d) {
            this.portMouseOver(d3.select(this), d, PORT_TYPE_OUTPUT, 0);
          })
          .on('mouseout', function (d) {
            this.portMouseOut(d3.select(this), d, PORT_TYPE_OUTPUT, 0);
          });


        inGroup.append('svg:text').attr('class', 'port_label').attr('x', 18).attr('y', 20).style('font-size', '10px').text('input');



        subflowOutputs.each(function (d, i) {
          if (d.dirty) {
            var output = d3.select(this);
            output.selectAll('.subflowport').classed('node_selected', function (d) {
              return d.selected;
            })
            output.selectAll('.port_index').text(function (d) {
              return d.i + 1
            });
            output.attr('transform', function (d) {
              return 'translate(' + (d.x - d.w / 2) + ',' + (d.y - d.h / 2) + ')';
            });
            dirtyNodes[d.id] = d;
            d.dirty = false;
          }
        });
        subflowInputs.each(function (d, i) {
          if (d.dirty) {
            var input = d3.select(this);
            input.selectAll('.subflowport').classed('node_selected', function (d) {
              return d.selected;
            })
            input.attr('transform', function (d) {
              return 'translate(' + (d.x - d.w / 2) + ',' + (d.y - d.h / 2) + ')';
            });
            dirtyNodes[d.id] = d;
            d.dirty = false;
          }
        });
      } else {
        vis.selectAll('.subflowoutput').remove();
        vis.selectAll('.subflowinput').remove();
      }

      var node = vis.selectAll('.nodegroup').data(activeNodes, function (d) {
        return d.id
      });
      node.exit().remove();

      var nodeEnter = node.enter().insert('svg:g')
        .attr('class', 'node nodegroup')
        .classed('node_subflow', function (d) {
          return activeSubflow != null;
        })
        .classed('node_link', function (d) {
          return d.type === 'link in' || d.type === 'link out'
        });

      nodeEnter.each(function (d, i) {
        var node = d3.select(this);
        var isLink = d.type === 'link in' || d.type === 'link out';
        node.attr('id', d.id);
        var l = this.RED.utils.getNodeLabel(d);
        if (isLink) {
          d.w = this.node_height;
        } else {
          d.w = Math.max(this.node_width, 20 * (Math.ceil((this.calculateTextWidth(l, 'node_label', 50) + (d._def.inputs > 0 ? 7 : 0)) / 20)));
        }
        d.h = Math.max(this.node_height, (d.outputs || 0) * 15);

        if (d._def.badge) {
          var badge = node.append('svg:g').attr('class', 'node_badge_group');
          var badgeRect = badge.append('rect').attr('class', 'node_badge').attr('rx', 5).attr('ry', 5).attr('width', 40).attr('height', 15);
          badge.append('svg:text').attr('class', 'node_badge_label').attr('x', 35).attr('y', 11).attr('text-anchor', 'end').text(d._def.badge());
          if (d._def.onbadgeclick) {
            badgeRect.attr('cursor', 'pointer')
              .on('click', function (d) {
                d._def.onbadgeclick.call(d);
                d3.event.preventDefault();
              });
          }
        }

        if (d._def.button) {
          var nodeButtonGroup = node.append('svg:g')
            .attr('transform', function (d) {
              return 'translate(' + ((d._def.align == 'right') ? 94 : -25) + ',2)';
            })
            .attr('class', function (d) {
              return 'node_button ' + ((d._def.align == 'right') ? 'node_right_button' : 'node_left_button');
            });
          nodeButtonGroup.append('rect')
            .attr('rx', 5)
            .attr('ry', 5)
            .attr('width', 32)
            .attr('height', this.node_height - 4)
            .attr('fill', '#eee'); //function(d) { return d._def.color;})
          nodeButtonGroup.append('rect')
            .attr('class', 'node_button_button')
            .attr('x', function (d) {
              return d._def.align == 'right' ? 11 : 5
            })
            .attr('y', 4)
            .attr('rx', 4)
            .attr('ry', 4)
            .attr('width', 16)
            .attr('height', this.node_height - 12)
            .attr('fill', function (d) {
              return d._def.color;
            })
            .attr('cursor', 'pointer')
            .on('mousedown', function (d) {
              if (!this.lasso && this.isButtonEnabled(d)) {
                this.focusView();
                d3.select(this).attr('fill-opacity', 0.2);
                d3.event.preventDefault();
                d3.event.stopPropagation();
              }
            })
            .on('mouseup', function (d) {
              if (!this.lasso && this.isButtonEnabled(d)) {
                d3.select(this).attr('fill-opacity', 0.4);
                d3.event.preventDefault();
                d3.event.stopPropagation();
              }
            })
            .on('mouseover', function (d) {
              if (!this.lasso && this.isButtonEnabled(d)) {
                d3.select(this).attr('fill-opacity', 0.4);
              }
            })
            .on('mouseout', function (d) {
              if (!this.lasso && this.isButtonEnabled(d)) {
                var op = 1;
                if (d._def.button.toggle) {
                  op = d[d._def.button.toggle] ? 1 : 0.2;
                }
                d3.select(this).attr('fill-opacity', op);
              }
            })
            .on('click', this.nodeButtonClicked)
            .on('touchstart', this.nodeButtonClicked)
        }

        var mainRect = node.append('rect')
          .attr('class', 'node')
          .classed('node_unknown', function (d) {
            return d.type == 'unknown';
          })
          .attr('rx', 5)
          .attr('ry', 5)
          .attr('fill', function (d) {
            return d._def.color;
          })
          .on('mouseup', this.nodeMouseUp)
          .on('mousedown', this.nodeMouseDown)
          .on('touchstart', function (d) {
            var obj = d3.select(this);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.startTouchCenter = [touch0.pageX, touch0.pageY];
            this.startTouchDistance = 0;
            this.touchStartTime = setTimeout(function () {
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
            this.nodeMouseDown.call(this, d)
          })
          .on('touchend', function (d) {
            clearTimeout(this.touchStartTime);
            this.touchStartTime = null;
            if (this.RED.touch.radialMenu.active()) {
              d3.event.stopPropagation();
              return;
            }
            this.nodeMouseUp.call(this, d);
          })
          .on('mouseover', function (d) {
            if (mouse_mode === 0) {
              var node = d3.select(this);
              node.classed('node_hovered', true);
            }
          })
          .on('mouseout', function (d) {
            var node = d3.select(this);
            node.classed('node_hovered', false);
          });

        //node.append('rect').attr('class', 'node-gradient-top').attr('rx', 6).attr('ry', 6).attr('height',30).attr('stroke','none').attr('fill','url(#gradient-top)').style('pointer-events','none');
        //node.append('rect').attr('class', 'node-gradient-bottom').attr('rx', 6).attr('ry', 6).attr('height',30).attr('stroke','none').attr('fill','url(#gradient-bottom)').style('pointer-events','none');

        if (d._def.icon) {
          var icon_url = this.RED.utils.getNodeIcon(d._def, d);
          var icon_group = node.append('g')
            .attr('class', 'node_icon_group')
            .attr('x', 0).attr('y', 0);

          var icon_shade = icon_group.append('rect')
            .attr('x', 0).attr('y', 0)
            .attr('class', 'node_icon_shade')
            .attr('width', '30')
            .attr('stroke', 'none')
            .attr('fill', '#000')
            .attr('fill-opacity', '0.05')
            .attr('height', function (d) {
              return Math.min(50, d.h - 4);
            });

          var icon = icon_group.append('image')
            .attr('xlink:href', icon_url)
            .attr('class', 'node_icon')
            .attr('x', 0)
            .attr('width', '30')
            .attr('height', '30');

          var icon_shade_border = icon_group.append('path')
            .attr('d', function (d) {
              return 'M 30 1 l 0 ' + (d.h - 2)
            })
            .attr('class', 'node_icon_shade_border')
            .attr('stroke-opacity', '0.1')
            .attr('stroke', '#000')
            .attr('stroke-width', '1');

          if ('right' == d._def.align) {
            icon_group.attr('class', 'node_icon_group node_icon_group_' + d._def.align);
            icon_shade_border.attr('d', function (d) {
              return 'M 0 1 l 0 ' + (d.h - 2)
            })
            //icon.attr('class','node_icon node_icon_'+d._def.align);
            //icon.attr('class','node_icon_shade node_icon_shade_'+d._def.align);
            //icon.attr('class','node_icon_shade_border node_icon_shade_border_'+d._def.align);
          }

          //if (d.inputs > 0 && d._def.align == null) {
          //    icon_shade.attr('width',35);
          //    icon.attr('transform','translate(5,0)');
          //    icon_shade_border.attr('transform','translate(5,0)');
          //}
          //if (d._def.outputs > 0 && 'right' == d._def.align) {
          //    icon_shade.attr('width',35); //icon.attr('x',5);
          //}

          var img = new Image();
          img.src = icon_url;
          img.onload = function () {
            icon.attr('width', Math.min(img.width, 30));
            icon.attr('height', Math.min(img.height, 30));
            icon.attr('x', 15 - Math.min(img.width, 30) / 2);
            //if ('right' == d._def.align) {
            //    icon.attr('x',function(d){return d.w-img.width-1-(d.outputs>0?5:0);});
            //    icon_shade.attr('x',function(d){return d.w-30});
            //    icon_shade_border.attr('d',function(d){return 'M '+(d.w-30)+' 1 l 0 '+(d.h-2);});
            //}
          }

          //icon.style('pointer-events','none');
          icon_group.style('pointer-events', 'none');
        }
        if (!isLink) {
          var text = node.append('svg:text').attr('class', 'node_label').attr('x', 38).attr('dy', '.35em').attr('text-anchor', 'start');
          if (d._def.align) {
            text.attr('class', 'node_label node_label_' + d._def.align);
            if (d._def.align === 'right') {
              text.attr('text-anchor', 'end');
            }
          }

          var status = node.append('svg:g').attr('class', 'node_status_group').style('display', 'none');

          var statusRect = status.append('rect').attr('class', 'node_status')
            .attr('x', 6).attr('y', 1).attr('width', 9).attr('height', 9)
            .attr('rx', 2).attr('ry', 2).attr('stroke-width', '3');

          var statusLabel = status.append('svg:text')
            .attr('class', 'node_status_label')
            .attr('x', 20).attr('y', 9);
        }
        //node.append('circle').attr({'class':'centerDot','cx':0,'cy':0,'r':5});

        //node.append('path').attr('class','node_error').attr('d','M 3,-3 l 10,0 l -5,-8 z');

        //TODO: these ought to be SVG
        node.append('image').attr('class', 'node_error hidden').attr('xlink:href', 'icons/node-red/node-error.png').attr('x', 0).attr('y', -6).attr('width', 10).attr('height', 9);
        node.append('image').attr('class', 'node_changed hidden').attr('xlink:href', 'icons/node-red/node-changed.png').attr('x', 12).attr('y', -6).attr('width', 10).attr('height', 10);
      });

      node.each(function (d, i) {
        if (d.dirty) {
          var isLink = d.type === 'link in' || d.type === 'link out';
          dirtyNodes[d.id] = d;
          //if (d.x < -50) deleteSelection();  // Delete nodes if dragged back to palette
          if (!isLink && d.resize) {
            var l = this.RED.utils.getNodeLabel(d);
            var ow = d.w;
            d.w = Math.max(this.node_width, 20 * (Math.ceil((this.calculateTextWidth(l, 'node_label', 50) + (d._def.inputs > 0 ? 7 : 0)) / 20)));
            d.h = Math.max(this.node_height, (d.outputs || 0) * 15);
            d.x += (d.w - ow) / 2;
            d.resize = false;
          }
          var thisNode = d3.select(this);
          //thisNode.selectAll('.centerDot').attr({'cx':function(d) { return d.w/2;},'cy':function(d){return d.h/2}});
          thisNode.attr('transform', function (d) {
            return 'translate(' + (d.x - d.w / 2) + ',' + (d.y - d.h / 2) + ')';
          });

          if (mouse_mode != this.RED.state.MOVING_ACTIVE) {
            thisNode.selectAll('.node')
              .attr('width', function (d) {
                return d.w
              })
              .attr('height', function (d) {
                return d.h
              })
              .classed('node_selected', function (d) {
                return d.selected;
              })
              .classed('node_highlighted', function (d) {
                return d.highlighted;
              });
            //thisNode.selectAll('.node-gradient-top').attr('width',function(d){return d.w});
            //thisNode.selectAll('.node-gradient-bottom').attr('width',function(d){return d.w}).attr('y',function(d){return d.h-30});

            thisNode.selectAll('.node_icon_group_right').attr('transform', function (d) {
              return 'translate(' + (d.w - 30) + ',0)'
            });
            thisNode.selectAll('.node_label_right').attr('x', function (d) {
              return d.w - 38
            });
            //thisNode.selectAll('.node_icon_right').attr('x',function(d){return d.w-d3.select(this).attr('width')-1-(d.outputs>0?5:0);});
            //thisNode.selectAll('.node_icon_shade_right').attr('x',function(d){return d.w-30;});
            //thisNode.selectAll('.node_icon_shade_border_right').attr('d',function(d){return 'M '+(d.w-30)+' 1 l 0 '+(d.h-2)});

            var inputPorts = thisNode.selectAll('.port_input');
            if (d.inputs === 0 && !inputPorts.empty()) {
              inputPorts.remove();
              //nodeLabel.attr('x',30);
            } else if (d.inputs === 1 && inputPorts.empty()) {
              var inputGroup = thisNode.append('g').attr('class', 'port_input');
              inputGroup.append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
                .on('mousedown', function (d) {
                  this.portMouseDown(d, PORT_TYPE_INPUT, 0);
                })
                .on('touchstart', function (d) {
                  this.portMouseDown(d, PORT_TYPE_INPUT, 0);
                })
                .on('mouseup', function (d) {
                  this.portMouseUp(d, PORT_TYPE_INPUT, 0);
                })
                .on('touchend', function (d) {
                  this.portMouseUp(d, PORT_TYPE_INPUT, 0);
                })
                .on('mouseover', function (d) {
                  this.portMouseOver(d3.select(this), d, PORT_TYPE_INPUT, 0);
                })
                .on('mouseout', function (d) {
                  this.portMouseOut(d3.select(this), d, PORT_TYPE_INPUT, 0);
                });
            }

            var numOutputs = d.outputs;
            var y = (d.h / 2) - ((numOutputs - 1) / 2) * 13;
            d.ports = d.ports || d3.range(numOutputs);
            d._ports = thisNode.selectAll('.port_output').data(d.ports);
            var output_group = d._ports.enter().append('g').attr('class', 'port_output');

            output_group.append('rect').attr('class', 'port').attr('rx', 3).attr('ry', 3).attr('width', 10).attr('height', 10)
              .on('mousedown', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseDown(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('touchstart', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseDown(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('mouseup', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseUp(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('touchend', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseUp(node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('mouseover', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseOver(d3.select(this), node, PORT_TYPE_OUTPUT, i);
                }
              })())
              .on('mouseout', (function () {
                var node = d;
                return function (d, i) {
                  this.portMouseOut(d3.select(this), node, PORT_TYPE_OUTPUT, i);
                }
              })());

            d._ports.exit().remove();
            if (d._ports) {
              numOutputs = d.outputs || 1;
              y = (d.h / 2) - ((numOutputs - 1) / 2) * 13;
              var x = d.w - 5;
              d._ports.each(function (d, i) {
                var port = d3.select(this);
                //port.attr('y',(y+13*i)-5).attr('x',x);
                port.attr('transform', function (d) {
                  return 'translate(' + x + ',' + ((y + 13 * i) - 5) + ')';
                });
              });
            }
            thisNode.selectAll('text.node_label').text(function (d, i) {
              var l: any = '';
              if (d._def.label) {
                l = d._def.label;
                try {
                  l = (typeof l === 'function' ? l.call(d) : l) || '';
                  l = this.RED.text.bidi.enforceTextDirectionWithUCC(l);
                } catch (err) {
                  console.log('Definition error: ' + d.type + '.label', err);
                  l = d.type;
                }
              }
              return l;
            })
              .attr('y', function (d) {
                return (d.h / 2) - 1;
              })
              .attr('class', function (d) {
                var s: any = '';
                if (d._def.labelStyle) {
                  s = d._def.labelStyle;
                  try {
                    s = (typeof s === 'function' ? s.call(d) : s) || '';
                  } catch (err) {
                    console.log('Definition error: ' + d.type + '.labelStyle', err);
                    s = '';
                  }
                  s = ' ' + s;
                }
                return 'node_label' +
                  (d._def.align ? ' node_label_' + d._def.align : '') + s;
              });

            if (d._def.icon) {
              this.icon = thisNode.select('.node_icon');
              var current_url = this.icon.attr('xlink:href');
              var new_url = this.RED.utils.getNodeIcon(d._def, d);
              if (new_url !== current_url) {
                this.icon.attr('xlink:href', new_url);
                var img = new Image();
                img.src = new_url;
                img.onload = () => {
                  this.icon.attr('width', Math.min(img.width, 30));
                  this.icon.attr('height', Math.min(img.height, 30));
                  this.icon.attr('x', 15 - Math.min(img.width, 30) / 2);
                }
              }
            }


            thisNode.selectAll('.node_tools').attr('x', function (d) {
              return d.w - 35;
            }).attr('y', function (d) {
              return d.h - 20;
            });

            thisNode.selectAll('.node_changed')
              .attr('x', function (d) {
                return d.w - 10
              })
              .classed('hidden', function (d) {
                return !(d.changed || d.moved);
              });

            thisNode.selectAll('.node_error')
              .attr('x', function (d) {
                return d.w - 10 - ((d.changed || d.moved) ? 13 : 0)
              })
              .classed('hidden', function (d) {
                return d.valid;
              });

            thisNode.selectAll('.port_input').each(function (d, i) {
              var port = d3.select(this);
              port.attr('transform', function (d) {
                return 'translate(-5,' + ((d.h / 2) - 5) + ')';
              })
            });

            thisNode.selectAll('.node_icon').attr('y', function (d) {
              return (d.h - d3.select(this).attr('height')) / 2;
            });
            thisNode.selectAll('.node_icon_shade').attr('height', function (d) {
              return d.h;
            });
            thisNode.selectAll('.node_icon_shade_border').attr('d', function (d) {
              return 'M ' + (('right' == d._def.align) ? 0 : 30) + ' 1 l 0 ' + (d.h - 2)
            });

            thisNode.selectAll('.node_button').attr('opacity', function (d) {
              return (activeSubflow || !this.isButtonEnabled(d)) ? 0.4 : 1
            });
            thisNode.selectAll('.node_button_button').attr('cursor', function (d) {
              return (activeSubflow || !this.isButtonEnabled(d)) ? '' : 'pointer';
            });
            thisNode.selectAll('.node_right_button').attr('transform', function (d) {
              var x = d.w - 6;
              if (d._def.button.toggle && !d[d._def.button.toggle]) {
                x = x - 8;
              }
              return 'translate(' + x + ',2)';
            });
            thisNode.selectAll('.node_right_button rect').attr('fill-opacity', function (d) {
              if (d._def.button.toggle) {
                return d[d._def.button.toggle] ? 1 : 0.2;
              }
              return 1;
            });

            //thisNode.selectAll('.node_right_button').attr('transform',function(d){return 'translate('+(d.w - d._def.button.width.call(d))+','+0+')';}).attr('fill',function(d) {
            //         return typeof d._def.button.color  === 'function' ? d._def.button.color.call(d):(d._def.button.color != null ? d._def.button.color : d._def.color)
            //});

            thisNode.selectAll('.node_badge_group').attr('transform', function (d) {
              return 'translate(' + (d.w - 40) + ',' + (d.h + 3) + ')';
            });
            thisNode.selectAll('text.node_badge_label').text(function (d, i) {
              if (d._def.badge) {
                if (typeof d._def.badge == 'function') {
                  try {
                    return d._def.badge.call(d);
                  } catch (err) {
                    console.log('Definition error: ' + d.type + '.badge', err);
                    return '';
                  }
                } else {
                  return d._def.badge;
                }
              }
              return '';
            });
          }

          if (!this.showStatus || !d.status) {
            thisNode.selectAll('.node_status_group').style('display', 'none');
          } else {
            thisNode.selectAll('.node_status_group').style('display', 'inline').attr('transform', 'translate(3,' + (d.h + 3) + ')');
            var fill = this.status_colours[d.status.fill]; // Only allow our colours for now
            if (d.status.shape == null && fill == null) {
              thisNode.selectAll('.node_status').style('display', 'none');
            } else {
              var style;
              if (d.status.shape == null || d.status.shape == 'dot') {
                style = {
                  display: 'inline',
                  fill: fill,
                  stroke: fill
                };
              } else if (d.status.shape == 'ring') {
                style = {
                  display: 'inline',
                  fill: '#fff',
                  stroke: fill
                }
              }
              thisNode.selectAll('.node_status').style(style);
            }
            if (d.status.text) {
              thisNode.selectAll('.node_status_label').text(d.status.text);
            } else {
              thisNode.selectAll('.node_status_label').text('');
            }
          }

          d.dirty = false;
        }
      });

      var link = vis.selectAll('.link').data(
        activeLinks,
        function (d) {
          return d.source.id + ':' + d.sourcePort + ':' + d.target.id + ':' + d.target.i;
        }
      );
      var linkEnter = link.enter().insert('g', '.node').attr('class', 'link');

      linkEnter.each((d, i) => {
        var l = d3.select(this);
        d.added = true;
        l.append('svg:path').attr('class', 'link_background link_path')
          .on('mousedown', (d) => {
            this.mousedown_link = d;
            this.clearSelection();
            this.selected_link = this.mousedown_link;
            this.updateSelection();
            this.redraw();
            this.focusView();
            d3.event.stopPropagation();
          })
          .on('touchstart', (d) => {
            this.mousedown_link = d;
            this.clearSelection();
            this.selected_link = this.mousedown_link;
            this.updateSelection();
            this.redraw();
            this.focusView();
            d3.event.stopPropagation();

            var obj = d3.select(document.body);
            var touch0 = d3.event.touches.item(0);
            var pos = [touch0.pageX, touch0.pageY];
            this.touchStartTime = setTimeout(() => {
              this.touchStartTime = null;
              this.showTouchMenu(obj, pos);
            }, this.touchLongPressTimeout);
          })
        l.append('svg:path').attr('class', 'link_outline link_path');
        l.append('svg:path').attr('class', 'link_line link_path')
          .classed('link_link', function (d) {
            return d.link
          })
          .classed('link_subflow', function (d) {
            return !d.link && activeSubflow
          });
      });

      link.exit().remove();
      var links = vis.selectAll('.link_path');
      links.each(function (d) {
        var link = d3.select(this);
        if (d.added || d === this.selected_link || d.selected || dirtyNodes[d.source.id] || dirtyNodes[d.target.id]) {
          link.attr('d', function (d) {
            var numOutputs = d.source.outputs || 1;
            var sourcePort = d.sourcePort || 0;
            var y = -((numOutputs - 1) / 2) * 13 + 13 * sourcePort;

            var dy = d.target.y - (d.source.y + y);
            var dx = (d.target.x - d.target.w / 2) - (d.source.x + d.source.w / 2);
            var delta = Math.sqrt(dy * dy + dx * dx);
            var scale = this.lineCurveScale;
            var scaleY = 0;
            if (delta < this.node_width) {
              scale = 0.75 - 0.75 * ((this.node_width - delta) / this.node_width);
            }

            if (dx < 0) {
              scale += 2 * (Math.min(5 * this.node_width, Math.abs(dx)) / (5 * this.node_width));
              if (Math.abs(dy) < 3 * this.node_height) {
                scaleY = ((dy > 0) ? 0.5 : -0.5) * (((3 * this.node_height) - Math.abs(dy)) / (3 * this.node_height)) * (Math.min(this.node_width, Math.abs(dx)) / (this.node_width));
              }
            }

            d.x1 = d.source.x + d.source.w / 2;
            d.y1 = d.source.y + y;
            d.x2 = d.target.x - d.target.w / 2;
            d.y2 = d.target.y;

            return 'M ' + d.x1 + ' ' + d.y1 +
              ' C ' + (d.x1 + scale * this.node_width) + ' ' + (d.y1 + scaleY * this.node_height) + ' ' +
              (d.x2 - scale * this.node_width) + ' ' + (d.y2 - scaleY * this.node_height) + ' ' +
              d.x2 + ' ' + d.y2;
          });
        }
      })

      link.classed('link_selected', function (d) {
        return d === this.selected_link || d.selected;
      });
      link.classed('link_unknown', function (d) {
        delete d.added;
        return d.target.type == 'unknown' || d.source.type == 'unknown'
      });
      var offLinks = vis.selectAll('.link_flow_link_g').data(
        activeFlowLinks,
        function (d) {
          return d.node.id + ':' + d.refresh
        }
      );

      var offLinksEnter = offLinks.enter().insert('g', '.node').attr('class', 'link_flow_link_g');
      offLinksEnter.each(function (d, i) {
        var g = d3.select(this);
        var s = 1;
        var labelAnchor = 'start';
        if (d.node.type === 'link in') {
          s = -1;
          labelAnchor = 'end';
        }
        var stemLength = s * 30;
        var branchLength = s * 20;
        var l = g.append('svg:path').attr('class', 'link_flow_link')
          .attr('class', 'link_link').attr('d', 'M 0 0 h ' + stemLength);
        var links = d.links;
        var flows = Object.keys(links);
        var tabOrder = this.RED.nodes.getWorkspaceOrder();
        flows.sort(function (A, B) {
          return tabOrder.indexOf(A) - tabOrder.indexOf(B);
        });
        var linkWidth = 10;
        var h = this.node_height;
        var y = -(flows.length - 1) * h / 2;
        var linkGroups = g.selectAll('.link_group').data(flows);
        var enterLinkGroups = linkGroups.enter().append('g').attr('class', 'link_group')
          .on('mouseover', function () {
            d3.select(this).classed('link_group_active', true)
          })
          .on('mouseout', function () {
            d3.select(this).classed('link_group_active', false)
          })
          .on('mousedown', function () {
            d3.event.preventDefault();
            d3.event.stopPropagation();
          })
          .on('mouseup', function (f) {
            d3.event.stopPropagation();
            var targets = d.links[f];
            this.RED.workspaces.show(f);
            targets.forEach(function (n) {
              n.selected = true;
              n.dirty = true;
              this.moving_set.push({
                n: n
              });
            });
            this.updateSelection();
            this.redraw();
          });
        enterLinkGroups.each(function (f) {
          var linkG = d3.select(this);
          linkG.append('svg:path').attr('class', 'link_flow_link')
            .attr('class', 'link_link')
            .attr('d',
            'M ' + stemLength + ' 0 ' +
            'C ' + (stemLength + (1.7 * branchLength)) + ' ' + 0 +
            ' ' + (stemLength + (0.1 * branchLength)) + ' ' + y + ' ' +
            (stemLength + branchLength * 1.5) + ' ' + y + ' '
            );
          linkG.append('svg:path')
            .attr('class', 'link_port')
            .attr('d',
            'M ' + (stemLength + branchLength * 1.5 + s * (linkWidth + 7)) + ' ' + (y - 12) + ' ' +
            'h ' + (-s * linkWidth) + ' ' +
            'a 3 3 45 0 ' + (s === 1 ? '0' : '1') + ' ' + (s * -3) + ' 3 ' +
            'v 18 ' +
            'a 3 3 45 0 ' + (s === 1 ? '0' : '1') + ' ' + (s * 3) + ' 3 ' +
            'h ' + (s * linkWidth)
            );
          linkG.append('svg:path')
            .attr('class', 'link_port')
            .attr('d',
            'M ' + (stemLength + branchLength * 1.5 + s * (linkWidth + 10)) + ' ' + (y - 12) + ' ' +
            'h ' + (s * (linkWidth * 3)) + ' ' +
            'M ' + (stemLength + branchLength * 1.5 + s * (linkWidth + 10)) + ' ' + (y + 12) + ' ' +
            'h ' + (s * (linkWidth * 3))
            ).style('stroke-dasharray', '12 3 8 4 3');
          linkG.append('rect').attr('class', 'port link_port')
            .attr('x', stemLength + branchLength * 1.5 - 4 + (s * 4))
            .attr('y', y - 4)
            .attr('rx', 2)
            .attr('ry', 2)
            .attr('width', 8)
            .attr('height', 8);
          linkG.append('rect')
            .attr('x', stemLength + branchLength * 1.5 - (s === -1 ? this.node_width : 0))
            .attr('y', y - 12)
            .attr('width', this.node_width)
            .attr('height', 24)
            .style('stroke', 'none')
            .style('fill', 'transparent')
          var tab = this.RED.nodes.workspace(f);
          var label;
          if (tab) {
            label = tab.label || tab.id;
          }
          linkG.append('svg:text')
            .attr('class', 'port_label')
            .attr('x', stemLength + branchLength * 1.5 + (s * 15))
            .attr('y', y + 1)
            .style('font-size', '10px')
            .style('text-anchor', labelAnchor)
            .text(label);

          y += h;
        });
        linkGroups.exit().remove();
      });
      offLinks.exit().remove();
      offLinks = vis.selectAll('.link_flow_link_g');
      offLinks.each(function (d) {
        var s = 1;
        if (d.node.type === 'link in') {
          s = -1;
        }
        var link = d3.select(this);
        link.attr('transform', function (d) {
          return 'translate(' + (d.node.x + (s * d.node.w / 2)) + ',' + (d.node.y) + ')';
        });

      })

    } else {
      // JOINING - unselect any selected links
      vis.selectAll('.link_selected').data(
        activeLinks,
        function (d) {
          return d.source.id + ':' + d.sourcePort + ':' + d.target.id + ':' + d.target.i;
        }
      ).classed('link_selected', false);
    }

    if (d3.event) {
      d3.event.preventDefault();
    }

    return this
  }

  focusView() {
    try {
      // Workaround for browser unexpectedly scrolling iframe into full
      // view - record the parent scroll position and restore it after
      // setting the focus
      var scrollX = window.parent.window.scrollX;
      var scrollY = window.parent.window.scrollY;
      $('#chart').focus();
      window.parent.window.scrollTo(scrollX, scrollY);
    } catch (err) {
      // In case we're iframed into a page of a different origin, just focus
      // the view following the inevitable DOMException
      $('#chart').focus();
    }
    return this
  }

  /**
   * Imports a new collection of nodes from a JSON String.
   *  - all get new IDs assigned
   *  - all 'selected'
   *  - attached to mouse for placing - 'IMPORT_DRAGGING'
   */
  importNodes(newNodesStr, addNewFlow?, touchImport?) {
    try {
      var activeSubflowChanged;
      if (this.activeSubflow) {
        activeSubflowChanged = this.activeSubflow.changed;
      }
      var result = this.RED.nodes.import(newNodesStr, true, addNewFlow);
      if (result) {
        var new_nodes = result[0];
        var new_links = result[1];
        var new_workspaces = result[2];
        var new_subflows = result[3];
        var new_default_workspace = result[4];
        if (addNewFlow && new_default_workspace) {
          this.RED.workspaces.show(new_default_workspace.id);
        }
        var new_ms = new_nodes.filter(function (n) {
          return n.hasOwnProperty('x') && n.hasOwnProperty('y') && n.z == this.RED.workspaces.active()
        }).map(function (n) {
          return {
            n: n
          };
        });
        var new_node_ids = new_nodes.map(function (n) {
          return n.id;
        });

        // TODO: pick a more sensible root node
        if (new_ms.length > 0) {
          var root_node = new_ms[0].n;
          var dx = root_node.x;
          var dy = root_node.y;

          if (this.mouse_position == null) {
            this.mouse_position = [0, 0];
          }

          var minX = 0;
          var minY = 0;
          var i;
          var node;

          for (i = 0; i < new_ms.length; i++) {
            node = new_ms[i];
            node.n.selected = true;
            node.n.changed = true;
            node.n.moved = true;
            node.n.x -= dx - this.mouse_position[0];
            node.n.y -= dy - this.mouse_position[1];
            node.dx = node.n.x - this.mouse_position[0];
            node.dy = node.n.y - this.mouse_position[1];
            minX = Math.min(node.n.x - this.node_width / 2 - 5, minX);
            minY = Math.min(node.n.y - this.node_height / 2 - 5, minY);
          }
          for (i = 0; i < new_ms.length; i++) {
            node = new_ms[i];
            node.n.x -= minX;
            node.n.y -= minY;
            node.dx -= minX;
            node.dy -= minY;
            if (node.n._def.onadd) {
              try {
                node.n._def.onadd.call(node.n);
              } catch (err) {
                console.log('Definition error: ' + node.n.type + '.onadd:', err);
              }
            }

          }
          if (!touchImport) {
            this.mouse_mode = this.RED.state.IMPORT_DRAGGING;
            this.spliceActive = false;
            if (new_ms.length === 1) {
              node = new_ms[0];
              this.spliceActive = node.n.hasOwnProperty('_def') &&
                node.n._def.inputs > 0 &&
                node.n._def.outputs > 0;
            }
          }
          this.RED.keyboard.add('*', 'escape', function () {
            this.RED.keyboard.remove('escape');
            this.clearSelection();
            this.RED.history.pop();
            this.mouse_mode = 0;
          });
          this.clearSelection();
          this.moving_set = new_ms;
        }

        var historyEvent: any = {
          t: 'add',
          nodes: new_node_ids,
          links: new_links,
          workspaces: new_workspaces,
          subflows: new_subflows,
          dirty: this.RED.nodes.dirty()
        };
        if (new_ms.length === 0) {
          this.RED.nodes.dirty(true);
        }
        if (this.activeSubflow) {
          var subflowRefresh = this.RED.subflow.refresh(true);
          if (subflowRefresh) {
            historyEvent.subflow = {
              id: this.activeSubflow.id,
              changed: activeSubflowChanged,
              instances: subflowRefresh.instances
            }
          }
        }
        this.RED.history.push(historyEvent);

        this.updateActiveNodes();
        this.redraw();
      }
    } catch (error) {
      // if (error.code != 'NODE_RED') {
      //   console.log(error.stack);
      //   this.RED.notify(this.RED._('notification.error', {
      //     message: error.toString()
      //   }), 'error');
      // } else {
      //   this.RED.notify(this.RED._('notification.error', {
      //     message: error.message
      //   }), 'error');
      // }
    }
    return this
  }

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

  toggleSnapGrid(state) {
    const {
      redraw
    } = this

    this.snapGrid = state;
    redraw();
    return this
  }

  toggleStatus(s) {
    this.showStatus = s;
    this.RED.nodes.eachNode(function (n) {
      n.dirty = true;
    });
    //TODO: subscribe/unsubscribe here
    this.redraw();
    return this
  }

  // API
  state(state) {
    if (state == null) {
      return this.mouse_mode
    } else {
      this.mouse_mode = state;
    }
    return this
  }

  select(selection) {
    const {
      clearSelection,
      updateSelection,
      redraw
    } = this

    if (typeof selection !== 'undefined') {
      clearSelection();
      if (typeof selection == 'string') {
        var selectedNode = this.RED.nodes.node(selection);
        if (selectedNode) {
          selectedNode.selected = true;
          selectedNode.dirty = true;
          this.moving_set = [{
            n: selectedNode
          }];
        }
      }
    }
    updateSelection();
    redraw();
    return this
  }

  selection() {
    var selection: any = {};
    if (this.moving_set.length > 0) {
      selection.nodes = this.moving_set.map(function (n) {
        return n.n;
      });
    }
    if (this.selected_link != null) {
      selection.link = this.selected_link;
    }
    return selection;
  }

  scale() {
    return this.scaleFactor;
  }

  getLinksAtPoint(x, y) {
    var result = [];
    var links = this.outer.selectAll('.link_background')[0];
    for (var i = 0; i < links.length; i++) {
      var bb = links[i].getBBox();
      if (x >= bb.x && y >= bb.y && x <= bb.x + bb.width && y <= bb.y + bb.height) {
        result.push(links[i])
      }
    }
    return result;
  }

  reveal(id) {
    if (this.RED.nodes.workspace(id) || this.RED.nodes.subflow(id)) {
      this.RED.workspaces.show(id);
    } else {
      var node = this.RED.nodes.node(id);
      if (node._def.category !== 'config' && node.z) {
        node.highlighted = true;
        node.dirty = true;
        this.RED.workspaces.show(node.z);

        var screenSize = [$('#chart').width(), $('#chart').height()];
        var scrollPos = [$('#chart').scrollLeft(), $('#chart').scrollTop()];

        if (node.x < scrollPos[0] || node.y < scrollPos[1] || node.x > screenSize[0] + scrollPos[0] || node.y > screenSize[1] + scrollPos[1]) {
          var deltaX = '-=' + ((scrollPos[0] - node.x) + screenSize[0] / 2);
          var deltaY = '-=' + ((scrollPos[1] - node.y) + screenSize[1] / 2);
          $('#chart').animate({
            scrollLeft: deltaX,
            scrollTop: deltaY
          }, 200);
        }

        if (!node._flashing) {
          node._flashing = true;
          var flash = 22;
          var flashFunc = function () {
            flash--;
            node.dirty = true;
            if (flash >= 0) {
              node.highlighted = !node.highlighted;
              setTimeout(flashFunc, 100);
            } else {
              node.highlighted = false;
              delete node._flashing;
            }
            this.RED.view.redraw();
          }
          flashFunc();
        }
      } else if (node._def.category === 'config') {
        this.RED.sidebar.config.show(id);
      }
    }
  }

  gridSize(v) {
    if (v === undefined) {
      return this.gridSize;
    } else {
      this.gridSize = v;
      this.updateGrid();
    }
  }

  handleD3MouseDownEvent(evt) {
    this.focusView();
  }

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

  handleOuterTouchStartEvent(touchStartTime,
    startTouchCenter,
    scaleFactor,
    startTouchDistance,
    touchLongPressTimeout) {
    const {
      clearTimeout,
      showTouchMenu
    } = this

    var touch0;
    if (!d3.event) {
      this.handleError('handleOuterTouchStartEvent: d3 missing event object', {
        // d3
        event: d3.event
      })
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
      var point = d3.touches(this)[0];
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

  handleWorkSpaceChangeEvent(event, workspaceScrollPositions) {
    {
      var chart = $('#chart');
      if (event.old !== 0) {
        workspaceScrollPositions[event.old] = {
          left: chart.scrollLeft(),
          top: chart.scrollTop()
        };
      }
      var scrollStartLeft = chart.scrollLeft();
      var scrollStartTop = chart.scrollTop();

      this.activeSubflow = this.RED.nodes.subflow(event.workspace);

      this.RED.menu.setDisabled('menu-item-workspace-edit', this.activeSubflow);
      this.RED.menu.setDisabled('menu-item-workspace-delete', this.RED.workspaces.count() == 1 || this.activeSubflow);

      if (workspaceScrollPositions[event.workspace]) {
        chart.scrollLeft(workspaceScrollPositions[event.workspace].left);
        chart.scrollTop(workspaceScrollPositions[event.workspace].top);
      } else {
        chart.scrollLeft(0);
        chart.scrollTop(0);
      }
      var scrollDeltaLeft = chart.scrollLeft() - scrollStartLeft;
      var scrollDeltaTop = chart.scrollTop() - scrollStartTop;
      if (this.mouse_position != null) {
        this.mouse_position[0] += scrollDeltaLeft;
        this.mouse_position[1] += scrollDeltaTop;
      }
      this.clearSelection();
      this.RED.nodes.eachNode(function (n) {
        n.dirty = true;
      });
      this.updateSelection();
      this.updateActiveNodes();
      this.redraw();
    }
  }
  init() {
    return new View().configure()
  }

}
