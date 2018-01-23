import {
  Context
} from '../../../context'
import { Canvas } from '../../';

export class CanvasMouse extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * TODO: if more D3 events, create separate D3MouseEventHandler class
   * handle D3 Mouse Down Event
   * @param evt
   */
  handleD3MouseDownEvent(evt) {
    this.focusView();
  }


  /**
   * canvas Mouse Move
   */
  canvasMouseMove() {
    const {
      // methods
      resetMouseVars,
      redraw,
      showDragLines,
      updateActiveNodes
    } = this.canvas

    var i;
    var node;

    // TODO: Fixed?
    const svgElem = this.vis
    this.mouse_position = d3.touches(svgElem)[0] || d3.mouse(svgElem);
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

  /**
   * canvas Mouse Up
   */
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
            var spliceLink: any = d3.select(this.activeSpliceLink).data()[0];
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

    if (!d3.event) {
      this.logWarning('canvasMouseDown: no d3.event', {
        event: d3.event
      })
      return this
    }

    if (this.mouse_mode === 0 || this.mouse_mode === this.RED.state.QUICK_JOINING) {
      if (d3.event.metaKey || d3.event.ctrlKey) {
        // TODO: Fixed?
        const svgElem = this.vis
        point = d3.mouse(svgElem);
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
        // TODO: Fixed?
        const svgElem = this.vis
        point = d3.mouse(svgElem);
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

  /**
   * reset Mouse Variables
   */
  resetMouseVars() {
    const {
      clearTimeout
    } = this.canvas


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
}
