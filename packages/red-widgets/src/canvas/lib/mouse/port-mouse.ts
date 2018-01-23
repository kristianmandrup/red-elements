import {
  Context
} from '../../../context'
import { Canvas } from '../../';

export class CanvasPortMouse extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * portMouseDown
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseDown(d, portType, portIndex) {
    const {
      // methods
      showDragLines
    } = this.canvas

    let {
      mouse_mode,
      mousedown_node,
      mousedown_port_type,
      mousedown_port_index
    } = this.canvas

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

  /**
   * port Mouse Up
   * @param d
   * @param portType
   * @param portIndex
   */
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

  /**
   * port Mouse Over
   * @param port
   * @param d
   * @param portType
   * @param portIndex
   */
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

  /**
   * port Mouse Out
   * @param port
   * @param d
   * @param portType
   * @param portIndex
   */
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

}
