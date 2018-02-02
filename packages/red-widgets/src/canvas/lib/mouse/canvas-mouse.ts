import {
  Context
} from '../../../context'
import { Canvas } from '../../';

import {
  d3
} from '../d3'

import {
  lazyInject,
  $TYPES
} from '../../../_container'

import {
  IState,
  INodes,
  ICanvas,
  IWorkspaces,
  IKeyboard,
  ITypeSearch,
  IEditor,
  IHistory
} from '../../../_interfaces'

const TYPES = $TYPES.all

export class CanvasMouse extends Context {

  @lazyInject(TYPES.state) state: IState
  @lazyInject(TYPES.nodes) nodes: INodes
  @lazyInject(TYPES.history) history: IHistory
  @lazyInject(TYPES.view) view: ICanvas
  @lazyInject(TYPES.workspaces) workspaces: IWorkspaces
  @lazyInject(TYPES.keyboard) keyboard: IKeyboard
  @lazyInject(TYPES.typeSearch) typeSearch: ITypeSearch
  @lazyInject(TYPES.editor) editor: IEditor

  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * TODO: if more D3 events, create separate D3MouseEventHandler class
   * handle D3 Mouse Down Event
   * @param evt
   */
  handleD3MouseDownEvent(evt) {
    const {
      focusView
    } = this.rebind([
        'focusView'
      ], this.canvas)

    focusView();
  }


  /**
   * canvas Mouse Move
   */
  canvasMouseMove() {
    const {
      RED,
      // methods
      resetMouseVars,
      redraw,
      showDragLines,
      updateActiveNodes,
      vis,
      lasso,
      drag_lines,
      mousedown_port_type,
      mousedown_port_index,
      mousedown_node,
      mouse_offset,
      lineCurveScale,
      node_width,
      node_height,
      moving_set,

      space_width,
      space_height,
      gridsize,
      snapGrid,

      PORT_TYPE_OUTPUT,
      PORT_TYPE_INPUT,
    } = this.canvas

    const {
      state,
      nodes,
      view,
      editor
    } = this

    let {
      clickElapsed,
      spliceActive,
      mouse_mode,
      mouse_position,
      selected_link,
      spliceTimer,
      activeSpliceLink,
    } = this.canvas

    var i;
    var node;

    // TODO: Fixed?
    const svgElem = vis
    mouse_position = d3.touches(svgElem)[0] || d3.mouse(svgElem);
    // Prevent touch scrolling...
    //if (d3.touches(this)[0]) {
    //    d3.event.preventDefault();
    //}

    // TODO: auto scroll the container
    //var point = d3.mouse(this);
    //if (point[0]-container.scrollLeft < 30 && container.scrollLeft > 0) { container.scrollLeft -= 15; }
    //console.log(d3.mouse(this),container.offsetWidth,container.offsetHeight,container.scrollLeft,container.scrollTop);

    if (lasso) {
      var ox = parseInt(lasso.attr('ox'));
      var oy = parseInt(lasso.attr('oy'));
      var x = parseInt(lasso.attr('x'));
      var y = parseInt(lasso.attr('y'));
      var w;
      var h;
      if (mouse_position[0] < ox) {
        x = mouse_position[0];
        w = ox - x;
      } else {
        w = mouse_position[0] - x;
      }
      if (mouse_position[1] < oy) {
        y = mouse_position[1];
        h = oy - y;
      } else {
        h = mouse_position[1] - y;
      }
      lasso
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h);
      return;
    }

    if (mouse_mode != state.QUICK_JOINING && mouse_mode != state.IMPORT_DRAGGING && !mousedown_node && selected_link == null) {
      return;
    }

    var mousePos;
    if (mouse_mode == state.JOINING || mouse_mode === state.QUICK_JOINING) {
      // update drag line
      if (drag_lines.length === 0) {
        if (d3.event.shiftKey) {
          // Get all the wires we need to detach.
          var links = [];
          var existingLinks = [];
          if (selected_link &&
            ((mousedown_port_type === PORT_TYPE_OUTPUT &&
              selected_link.source === mousedown_node &&
              selected_link.sourcePort === mousedown_port_index
            ) ||
              (mousedown_port_type === PORT_TYPE_INPUT &&
                selected_link.target === mousedown_node
              ))
          ) {
            existingLinks = [selected_link];
          } else {
            var filter;
            if (mousedown_port_type === PORT_TYPE_OUTPUT) {
              filter = {
                source: mousedown_node,
                sourcePort: mousedown_port_index
              }
            } else {
              filter = {
                target: mousedown_node
              }
            }
            existingLinks = nodes.filterLinks(filter);
          }
          for (i = 0; i < existingLinks.length; i++) {
            var link = existingLinks[i];
            nodes.removeLink(link);
            links.push({
              link: link,
              node: (mousedown_port_type === PORT_TYPE_OUTPUT) ? link.target : link.source,
              port: (mousedown_port_type === PORT_TYPE_OUTPUT) ? 0 : link.sourcePort,
              portType: (mousedown_port_type === PORT_TYPE_OUTPUT) ? PORT_TYPE_INPUT : PORT_TYPE_OUTPUT
            })
          }
          if (links.length === 0) {
            resetMouseVars();
            redraw();
          } else {
            showDragLines(links);
            mouse_mode = 0;
            updateActiveNodes();
            redraw();
            mouse_mode = state.JOINING;
          }
        } else if (mousedown_node) {
          showDragLines([{
            node: mousedown_node,
            port: mousedown_port_index,
            portType: mousedown_port_type
          }]);
        }
        selected_link = null;
      }
      mousePos = mouse_position;
      for (i = 0; i < drag_lines.length; i++) {
        var drag_line = drag_lines[i];
        var numOutputs = (drag_line.portType === PORT_TYPE_OUTPUT) ? (drag_line.node.outputs || 1) : 1;
        var sourcePort = drag_line.port;
        var portY = -((numOutputs - 1) / 2) * 13 + 13 * sourcePort;

        var sc = (drag_line.portType === PORT_TYPE_OUTPUT) ? 1 : -1;

        var dy = mousePos[1] - (drag_line.node.y + portY);
        var dx = mousePos[0] - (drag_line.node.x + sc * drag_line.node.w / 2);
        var delta = Math.sqrt(dy * dy + dx * dx);
        var scale = lineCurveScale;
        var scaleY = 0;

        if (delta < node_width) {
          scale = 0.75 - 0.75 * ((node_width - delta) / node_width);
        }
        if (dx * sc < 0) {
          scale += 2 * (Math.min(5 * node_width, Math.abs(dx)) / (5 * node_width));
          if (Math.abs(dy) < 3 * node_height) {
            scaleY = ((dy > 0) ? 0.5 : -0.5) * (((3 * node_height) - Math.abs(dy)) / (3 * node_height)) * (Math.min(node_width, Math.abs(dx)) / (node_width));
          }
        }

        drag_line.el.attr('d',
          'M ' + (drag_line.node.x + sc * drag_line.node.w / 2) + ' ' + (drag_line.node.y + portY) +
          ' C ' + (drag_line.node.x + sc * (drag_line.node.w / 2 + node_width * scale)) + ' ' + (drag_line.node.y + portY + scaleY * node_height) + ' ' +
          (mousePos[0] - sc * (scale) * node_width) + ' ' + (mousePos[1] - scaleY * node_height) + ' ' +
          mousePos[0] + ' ' + mousePos[1]
        );
      }
      d3.event.preventDefault();
    } else if (mouse_mode == state.MOVING) {
      mousePos = d3.mouse(document.body);
      if (isNaN(mousePos[0])) {
        mousePos = d3.touches(document.body)[0];
      }
      var d = (mouse_offset[0] - mousePos[0]) * (mouse_offset[0] - mousePos[0]) + (mouse_offset[1] - mousePos[1]) * (mouse_offset[1] - mousePos[1]);
      if (d > 3) {
        mouse_mode = state.MOVING_ACTIVE;
        clickElapsed = 0;
        spliceActive = false;
        if (moving_set.length === 1) {
          node = moving_set[0];
          spliceActive = node.n.hasOwnProperty('_def') &&
            node.n._def.inputs > 0 &&
            node.n._def.outputs > 0 &&
            nodes.filterLinks({
              source: node.n
            }).length === 0 &&
            nodes.filterLinks({
              target: node.n
            }).length === 0;
        }
      }
    } else if (mouse_mode == state.MOVING_ACTIVE || mouse_mode == state.IMPORT_DRAGGING) {
      mousePos = mouse_position;
      var minX = 0;
      var minY = 0;
      var maxX = space_width;
      var maxY = space_height;
      for (var n = 0; n < moving_set.length; n++) {
        node = moving_set[n];
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
        for (i = 0; i < moving_set.length; i++) {
          node = moving_set[i];
          node.n.x -= minX;
          node.n.y -= minY;
        }
      }
      if (maxX !== space_width || maxY !== space_height) {
        for (i = 0; i < moving_set.length; i++) {
          node = moving_set[i];
          node.n.x -= (maxX - space_width);
          node.n.y -= (maxY - space_height);
        }
      }
      if (snapGrid != d3.event.shiftKey && moving_set.length > 0) {
        var gridOffset = [0, 0];
        node = moving_set[0];
        gridOffset[0] = node.n.x - (gridsize * Math.floor((node.n.x - node.n.w / 2) / gridsize) + node.n.w / 2);
        gridOffset[1] = node.n.y - (gridsize * Math.floor(node.n.y / gridsize));
        if (gridOffset[0] !== 0 || gridOffset[1] !== 0) {
          for (i = 0; i < moving_set.length; i++) {
            node = moving_set[i];
            node.n.x -= gridOffset[0];
            node.n.y -= gridOffset[1];
            if (node.n.x == node.n.ox && node.n.y == node.n.oy) {
              node.dirty = false;
            }
          }
        }
      }
      if ((mouse_mode == state.MOVING_ACTIVE || mouse_mode == state.IMPORT_DRAGGING) && moving_set.length === 1) {
        node = moving_set[0];
        if (spliceActive) {
          if (!spliceTimer) {
            spliceTimer = setTimeout(function () {
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
                nodes = view.getLinksAtPoint(mouseX, mouseY);
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
              if (activeSpliceLink && activeSpliceLink !== bestLink) {
                d3.select(activeSpliceLink.parentNode).classed('link_splice', false);
              }
              if (bestLink) {
                d3.select(bestLink.parentNode).classed('link_splice', true)
              } else {
                d3.select('.link_splice').classed('link_splice', false);
              }
              activeSpliceLink = bestLink;
              spliceTimer = null;
            }, 100);
          }
        }
      }


    }
    if (mouse_mode !== 0) {
      redraw();
    }
  }

  /**
   * canvas Mouse Up
   */
  canvasMouseUp() {
    const {
      RED,
      canvas,
      state,
      nodes,
      history,
      workspaces,
      keyboard
    } = this

    const {
      mouse_mode,
      mousedown_node,
      mousedown_link,
      drag_lines,
      moving_set,
      activeSubflow,
      activeSpliceLink
    } = canvas
    let {
      lasso,
    } = canvas
    const {
      hideDragLines,
      clearSelection,
      updateSelection,
      updateActiveNodes,
      resetMouseVars,
      redraw
    } = this.rebind([
        'hideDragLines',
        'clearSelection',
        'updateSelection',
        'updateActiveNodes',
        'resetMouseVars',
        'redraw'
      ])

    var historyEvent;
    if (mouse_mode === state.QUICK_JOINING) {
      return;
    }
    if (mousedown_node && mouse_mode == state.JOINING) {
      var removedLinks = [];
      for (let i = 0; i < drag_lines.length; i++) {
        if (drag_lines[i].link) {
          removedLinks.push(drag_lines[i].link)
        }
      }
      historyEvent = {
        t: 'delete',
        links: removedLinks,
        dirty: nodes.dirty()
      };
      history.push(historyEvent);
      hideDragLines();
    }
    if (lasso) {
      var x = parseInt(lasso.attr('x'));
      var y = parseInt(lasso.attr('y'));
      var x2 = x + parseInt(lasso.attr('width'));
      var y2 = y + parseInt(lasso.attr('height'));
      if (!d3.event.ctrlKey) {
        clearSelection();
      }
      nodes.eachNode(function (n) {
        const { workspaces } = this
        if (n.z == workspaces.active() && !n.selected) {
          n.selected = (n.x > x && n.x < x2 && n.y > y && n.y < y2);
          if (n.selected) {
            n.dirty = true;
            moving_set.push({
              n: n
            });
          }
        }
      });
      if (activeSubflow) {
        activeSubflow.in.forEach(function (n) {
          n.selected = (n.x > x && n.x < x2 && n.y > y && n.y < y2);
          if (n.selected) {
            n.dirty = true;
            moving_set.push({
              n: n
            });
          }
        });
        activeSubflow.out.forEach(function (n) {
          n.selected = (n.x > x && n.x < x2 && n.y > y && n.y < y2);
          if (n.selected) {
            n.dirty = true;
            moving_set.push({
              n: n
            });
          }
        });
      }
      updateSelection();
      lasso.remove();
      lasso = null;
    } else if (mouse_mode == state.DEFAULT && mousedown_link == null && !d3.event.ctrlKey && !d3.event.metaKey) {
      clearSelection();
      updateSelection();
    }
    if (mouse_mode == state.MOVING_ACTIVE) {
      if (moving_set.length > 0) {
        var ns = [];
        for (var j = 0; j < moving_set.length; j++) {
          var n = moving_set[j];
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
            dirty: nodes.dirty()
          };
          if (activeSpliceLink) {
            // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
            var spliceLink: any = d3.select(activeSpliceLink).data()[0];
            nodes.removeLink(spliceLink);
            var link1 = {
              source: spliceLink.source,
              sourcePort: spliceLink.sourcePort,
              target: moving_set[0].n
            };
            var link2 = {
              source: moving_set[0].n,
              sourcePort: 0,
              target: spliceLink.target
            };
            nodes.addLink(link1);
            nodes.addLink(link2);
            historyEvent.links = [link1, link2];
            historyEvent.removedLinks = [spliceLink];
            updateActiveNodes();
          }
          nodes.dirty(true);
          history.push(historyEvent);
        }
      }
    }
    if (mouse_mode == state.MOVING || mouse_mode == state.MOVING_ACTIVE) {
      for (let i = 0; i < moving_set.length; i++) {
        delete moving_set[i].ox;
        delete moving_set[i].oy;
      }
    }
    if (mouse_mode == state.IMPORT_DRAGGING) {
      keyboard.remove('escape');
      updateActiveNodes();
      nodes.dirty(true);
    }
    resetMouseVars();
    redraw();
  }

  canvasMouseDown() {
    const {
      RED,
      canvas,
      state,
      nodes,
      history,
      typeSearch,
      editor
    } = this
    const {
      mousedown_node,
      mousedown_link,
      vis,
      drag_lines,
      node_width,
      node_height,
      PORT_TYPE_OUTPUT,
      PORT_TYPE_INPUT,
      moving_set,
      touchStartTime,
    } = canvas
    const {
      updateSelection,
      disableQuickJoinEventHandler,
      updateActiveNodes,
      redraw,
    } = this.rebind([
        'updateSelection',
        'disableQuickJoinEventHandler',
        'updateActiveNodes',
        'redraw',
      ])

    let {
      lasso,
      selected_link,
      mouse_mode
    } = canvas

    let point;

    if (!mousedown_node && !mousedown_link) {
      selected_link = null;
      updateSelection();
    }
    if (mouse_mode === 0) {
      if (lasso) {
        lasso.remove();
        lasso = null;
      }
    }

    if (!d3.event) {
      this.logWarning('canvasMouseDown: no d3.event', {
        event: d3.event
      })
      return this
    }

    if (mouse_mode === 0 || mouse_mode === state.QUICK_JOINING) {
      if (d3.event.metaKey || d3.event.ctrlKey) {
        // TODO: Fixed?
        const svgElem = vis
        point = d3.mouse(svgElem);
        d3.event.stopPropagation();
        var mainPos = $('#main-container').position();

        if (mouse_mode !== state.QUICK_JOINING) {
          mouse_mode = state.QUICK_JOINING;
          $(window).on('keyup', disableQuickJoinEventHandler);
        }

        typeSearch.show({
          x: d3.event.clientX - mainPos.left - node_width / 2,
          y: d3.event.clientY - mainPos.top - node_height / 2,
          add: function (type) {
            var result = this.addNode(type);
            if (!result) {
              return;
            }
            var nn = result.node;
            var historyEvent = result.historyEvent;
            nn.x = point[0];
            nn.y = point[1];
            if (mouse_mode === state.QUICK_JOINING) {
              if (drag_lines.length > 0) {
                var drag_line = drag_lines[0];
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
                  nodes.addLink(link);
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


            history.push(historyEvent);
            nodes.add(nn);
            editor.validateNode(nn);
            nodes.dirty(true);
            // auto select dropped node - so info shows (if visible)
            this.clearSelection();
            nn.selected = true;
            moving_set.push({
              n: nn
            });
            this.updateActiveNodes();
            this.updateSelection();
            this.redraw();
          }
        });

        updateActiveNodes();
        updateSelection();
        redraw();
      }
    }
    if (mouse_mode === 0 && !(d3.event.metaKey || d3.event.ctrlKey)) {
      if (!touchStartTime) {
        // TODO: Fixed?
        const svgElem = vis
        point = d3.mouse(svgElem);
        lasso = vis.append('rect')
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

  /**
   * reset Mouse Variables
   */
  resetMouseVars() {
    const {
      canvas,
      setInstanceVars
    } = this

    const {
      PORT_TYPE_OUTPUT
    } = canvas

    let {
      spliceTimer,
      mousedown_node,
      mouseup_node,
      mousedown_link,
      mouse_mode,
      mousedown_port_type,
      activeSpliceLink,
      spliceActive
    } = canvas
    const {
      clearTimeout
    } = this.rebind([
        'clearTimeout'
      ], canvas)

    mousedown_node = null;
    mouseup_node = null;
    mousedown_link = null;
    mouse_mode = 0;
    mousedown_port_type = PORT_TYPE_OUTPUT;
    activeSpliceLink = null;
    spliceActive = false;
    d3.select('.link_splice').classed('link_splice', false);
    if (spliceTimer) {
      clearTimeout(spliceTimer);
      spliceTimer = null;
    }

    setInstanceVars({
      mousedown_node,
      mouseup_node,
      mousedown_link,
      mouse_mode,
      mousedown_port_type,
      activeSpliceLink,
      spliceActive,
      spliceTimer
    })
  }
}
