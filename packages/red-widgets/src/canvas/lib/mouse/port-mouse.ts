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
  IWorkspaces,
  ISubflow,
  IHistory
} from '../../../_interfaces'

const TYPES = $TYPES.all

export class CanvasPortMouse extends Context {

  @lazyInject(TYPES.state) state: IState
  @lazyInject(TYPES.nodes) nodes: INodes
  @lazyInject(TYPES.workspaces) workspaces: IWorkspaces
  @lazyInject(TYPES.subflow) subflow: ISubflow
  @lazyInject(TYPES.history) history: IHistory
  


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
      canvas,
      RED,
      rebind,
      state,
      workspaces,
      subflow
    } = this
    const {
      // methods
      showDragLines
    } = canvas
    const {
      disableQuickJoinEventHandler
    } = rebind([
        'disableQuickJoinEventHandler'
      ])
    let {
      mouse_mode,
      mousedown_node,
      mousedown_port_type,
      mousedown_port_index
    } = canvas

    //console.log(d,portType,portIndex);
    // disable zoom
    //vis.call(d3.behavior.zoom().on('zoom'), null);
    mousedown_node = d;
    mousedown_port_type = portType;
    mousedown_port_index = portIndex || 0;
    if (mouse_mode !== state.QUICK_JOINING) {
      mouse_mode = state.JOINING;
      document.body.style.cursor = 'crosshair';
      if (d3.event.ctrlKey || d3.event.metaKey) {
        mouse_mode = state.QUICK_JOINING;
        showDragLines([{
          node: mousedown_node,
          port: mousedown_port_index,
          portType: mousedown_port_type
        }]);
        $(window).on('keyup', disableQuickJoinEventHandler);
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
      canvas,
      RED,
      rebind,
      state,
      nodes,
      workspaces,
      subflow,
      history
    } = this
    const {
      mouse_mode,
      drag_lines,
      mouse_position,
      PORT_TYPE_INPUT,
      PORT_TYPE_OUTPUT,
      activeSubflow
    } = canvas
    const {
      updateActiveNodes,
      hideDragLines,
      showDragLines,
      resetMouseVars,
      redraw,
    } = rebind([
        'updateActiveNodes',
        'hideDragLines',
        'showDragLines',
        'resetMouseVars',
        'redraw',
      ], canvas)

    let {
      mouseup_node,
      selected_link
    } = canvas

    if (mouse_mode === state.QUICK_JOINING) {
      if (drag_lines[0].node === d) {
        return
      }
    }
    document.body.style.cursor = '';
    if (mouse_mode == state.JOINING || mouse_mode == state.QUICK_JOINING) {
      if (typeof TouchEvent != 'undefined' && d3.event instanceof TouchEvent) {
        nodes.eachNode(function (n) {
          if (n.z == workspaces.active()) {
            var hw = n.w / 2;
            var hh = n.h / 2;
            if (n.x - hw < mouse_position[0] && n.x + hw > mouse_position[0] &&
              n.y - hh < mouse_position[1] && n.y + hh > mouse_position[1]) {
              mouseup_node = n;
              portType = mouseup_node.inputs > 0 ? PORT_TYPE_INPUT : PORT_TYPE_OUTPUT;
              portIndex = 0;
            }
          }
        });
      } else {
        mouseup_node = d;
      }
      var addedLinks = [];
      var removedLinks = [];

      for (let i = 0; i < drag_lines.length; i++) {
        if (drag_lines[i].link) {
          removedLinks.push(drag_lines[i].link)
        }
      }
      for (let i = 0; i < drag_lines.length; i++) {
        if (portType != drag_lines[i].portType && mouseup_node !== drag_lines[i].node) {
          var drag_line = drag_lines[i];
          var src, dst, src_port;
          if (drag_line.portType === PORT_TYPE_OUTPUT) {
            src = drag_line.node;
            src_port = drag_line.port;
            dst = mouseup_node;
          } else if (drag_line.portType === PORT_TYPE_INPUT) {
            src = mouseup_node;
            dst = drag_line.node;
            src_port = portIndex;
          }
          var existingLink = nodes.filterLinks({
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
            nodes.addLink(link);
            addedLinks.push(link);
          }
        }
      }
      if (addedLinks.length > 0 || removedLinks.length > 0) {
        var historyEvent: any = {
          t: 'add',
          links: addedLinks,
          removedLinks: removedLinks,
          dirty: nodes.dirty()
        };
        if (activeSubflow) {
          var subflowRefresh = subflow.refresh(true);
          if (subflowRefresh) {
            historyEvent.subflow = {
              id: activeSubflow.id,
              changed: activeSubflow.changed,
              instances: subflowRefresh.instances
            }
          }
        }
        history.push(historyEvent);
        updateActiveNodes();
        nodes.dirty(true);
      }
      if (mouse_mode === state.QUICK_JOINING) {
        if (addedLinks.length > 0) {
          hideDragLines();
          if (portType === PORT_TYPE_INPUT && d.outputs > 0) {
            showDragLines([{
              node: d,
              port: 0,
              portType: PORT_TYPE_OUTPUT
            }]);
          } else if (portType === PORT_TYPE_OUTPUT && d.inputs > 0) {
            showDragLines([{
              node: d,
              port: 0,
              portType: PORT_TYPE_INPUT
            }]);
          } else {
            resetMouseVars();
          }
        }
        redraw();
        return;
      }

      resetMouseVars();
      hideDragLines();
      selected_link = null;
      redraw();
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
    const {
      RED,
      canvas,
      rebind,
      state
    } = this
    const {
      PORT_TYPE_OUTPUT,
      PORT_TYPE_INPUT,
      drag_lines,
      mouse_mode,
      vis
    } = canvas
    let {
      portLabelHover,
    } = canvas
    let {
      portLabelHoverTimeout,
    } = rebind([
        'portLabelHoverTimeout',
      ])

    const {
      getPortLabel,
      getElementPosition,
      calculateTextDimensions
    } = rebind([
        'getPortLabel',
        'getElementPosition',
        'calculateTextDimensions'
      ])

    clearTimeout(portLabelHoverTimeout);
    var active = (mouse_mode != state.JOINING || (drag_lines.length > 0 && drag_lines[0].portType !== portType));
    if (active && ((portType === PORT_TYPE_INPUT && ((d._def && d._def.inputLabels) || d.inputLabels)) || (portType === PORT_TYPE_OUTPUT && ((d._def && d._def.outputLabels) || d.outputLabels)))) {
      portLabelHoverTimeout = setTimeout(function () {
        var tooltip = getPortLabel(d, portType, portIndex);
        if (!tooltip) {
          return;
        }
        var pos = getElementPosition(port.node());
        portLabelHoverTimeout = null;
        portLabelHover = vis.append('g')
          .attr('transform', 'translate(' + (pos[0] + (portType === PORT_TYPE_INPUT ? -2 : 12)) + ',' + (pos[1] + 5) + ')')
          .attr('class', 'port_tooltip');
        var lines = tooltip.split('\n');
        var labelWidth = 0;
        var labelHeight = 4;
        var labelHeights = [];
        lines.forEach(function (l) {
          var labelDimensions = calculateTextDimensions(l, 'port_tooltip_label', 8, 0);
          labelWidth = Math.max(labelWidth, labelDimensions[0]);
          labelHeights.push(0.8 * labelDimensions[1]);
          labelHeight += 0.8 * labelDimensions[1];
        });

        var labelHeight1 = (labelHeight / 2) - 5 - 2;
        var labelHeight2 = labelHeight - 4;
        portLabelHover.append('path').attr('d',
          portType === PORT_TYPE_INPUT ?
            'M0 0 l -5 -5 v -' + (labelHeight1) + ' q 0 -2 -2 -2 h -' + labelWidth + ' q -2 0 -2 2 v ' + (labelHeight2) + ' q 0 2 2 2 h ' + labelWidth + ' q 2 0 2 -2 v -' + (labelHeight1) + ' l 5 -5' :
            'M0 0 l 5 -5 v -' + (labelHeight1) + ' q 0 -2 2 -2 h ' + labelWidth + ' q 2 0 2 2 v ' + (labelHeight2) + ' q 0 2 -2 2 h -' + labelWidth + ' q -2 0 -2 -2 v -' + (labelHeight1) + ' l -5 -5'
        );
        var y = -labelHeight / 2 - 2;
        lines.forEach(function (l, i) {
          y += labelHeights[i];
          portLabelHover.append('svg:text').attr('class', 'port_tooltip_label')
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
      canvas,
      rebind
    } = this
    const {
      clearTimeout,
    } = canvas
    const {
      portLabelHoverTimeout
    } = rebind([
        'portLabelHoverTimeout'
      ])
    let {
      portLabelHover,
    } = canvas

    clearTimeout(portLabelHoverTimeout);
    if (portLabelHover) {
      portLabelHover.remove();
      portLabelHover = null;
    }
    port.classed('port_hovered', false);
  }

}
