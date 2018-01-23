import {
  Context
} from '../../../context'
import { Canvas } from '../../';

import {
  d3
} from '../d3'

export class CanvasNodeMouse extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * node Mouse Up handler
   * @param d
   */
  nodeMouseUp(d) {
    const {
      RED,
      rebind,
      canvas
    } = this
    const {
      dblClickPrimed,
      mousedown_node,
      activeSubflow
    } = canvas
    const {
      portMouseUp
    } = rebind([
        'portMouseUp'
      ])
    let {
      mouse_mode,
      clickElapsed,
    } = canvas

    if (dblClickPrimed && mousedown_node == d && clickElapsed > 0 && clickElapsed < 750) {
      mouse_mode = RED.state.DEFAULT;
      if (d.type != 'subflow') {
        RED.editor.edit(d);
      } else {
        RED.editor.editSubflow(activeSubflow);
      }
      clickElapsed = 0;
      d3.event.stopPropagation();
      return;
    }
    var direction = d._def ? (d.inputs > 0 ? 1 : 0) : (d.direction == 'in' ? 0 : 1)
    portMouseUp(d, direction, 0);
  }

  /**
   * node Mouse Down handler
   * @param d
   */
  nodeMouseDown(d) {
    const {
      RED,
      rebind,
      canvas
    } = this
    const {
      activeSpliceLink,
      moving_set,
      vis
    } = canvas

    let {
      mousedown_node,
      clickElapsed,
      clickTime,
      dblClickPrimed,
      lastClickNode,
      selected_link,
      mouse_mode,
      mouse_offset
    } = canvas

    const {
      focusView,
      updateActiveNodes,
      updateSelection,
      resetMouseVars,
      redraw,
      clearSelection
    } = rebind([
        'focusView',
        'updateActiveNodes',
        'updateSelection',
        'resetMouseVars',
        'redraw',
        'clearSelection'
      ], canvas)

    focusView();
    //var touch0 = d3.event;
    //var pos = [touch0.pageX,touch0.pageY];
    //RED.touch.radialMenu.show(d3.select(this),pos);
    if (mouse_mode == RED.state.IMPORT_DRAGGING) {
      RED.keyboard.remove('escape');

      if (activeSpliceLink) {
        // TODO: DRY - droppable/nodeMouseDown/canvasMouseUp
        const spliceLink: any = d3.select(activeSpliceLink).data()[0];
        RED.nodes.removeLink(spliceLink);
        const link1 = {
          source: spliceLink.source,
          sourcePort: spliceLink.sourcePort,
          target: moving_set[0].n
        };
        const link2 = {
          source: moving_set[0].n,
          sourcePort: 0,
          target: spliceLink.target
        };
        RED.nodes.addLink(link1);
        RED.nodes.addLink(link2);
        var historyEvent = RED.history.peek();
        historyEvent.links = [link1, link2];
        historyEvent.removedLinks = [spliceLink];
        updateActiveNodes();
      }

      updateSelection();
      RED.nodes.dirty(true);
      redraw();
      resetMouseVars();
      d3.event.stopPropagation();
      return;
    } else if (mouse_mode == RED.state.QUICK_JOINING) {
      d3.event.stopPropagation();
      return;
    }
    mousedown_node = d;
    var now = Date.now();
    clickElapsed = now - clickTime;
    clickTime = now;

    dblClickPrimed = (lastClickNode == mousedown_node);
    lastClickNode = mousedown_node;

    var i;

    if (d.selected && (d3.event.ctrlKey || d3.event.metaKey)) {
      mousedown_node.selected = false;
      for (i = 0; i < moving_set.length; i += 1) {
        if (moving_set[i].n === mousedown_node) {
          moving_set.splice(i, 1);
          break;
        }
      }
    } else {
      if (d3.event.shiftKey) {
        clearSelection();
        var cnodes = RED.nodes.getAllFlowNodes(mousedown_node);
        for (var n = 0; n < cnodes.length; n++) {
          cnodes[n].selected = true;
          cnodes[n].dirty = true;
          moving_set.push({
            n: cnodes[n]
          });
        }
      } else if (!d.selected) {
        if (!d3.event.ctrlKey && !d3.event.metaKey) {
          clearSelection();
        }
        mousedown_node.selected = true;
        moving_set.push({
          n: mousedown_node
        });
      }
      selected_link = null;
      if (d3.event.button != 2) {
        mouse_mode = RED.state.MOVING;
        // TODO: Fixes?
        const svgElem = vis

        var mouse = d3.touches(svgElem)[0] || d3.mouse(svgElem);
        mouse[0] += d.x - d.w / 2;
        mouse[1] += d.y - d.h / 2;
        for (i = 0; i < moving_set.length; i++) {
          moving_set[i].ox = moving_set[i].n.x;
          moving_set[i].oy = moving_set[i].n.y;
          moving_set[i].dx = moving_set[i].n.x - mouse[0];
          moving_set[i].dy = moving_set[i].n.y - mouse[1];
        }
        mouse_offset = d3.mouse(document.body);
        if (isNaN(mouse_offset[0])) {
          mouse_offset = d3.touches(document.body)[0];
        }
      }
    }
    d.dirty = true;
    updateSelection();
    redraw();
    d3.event.stopPropagation();
  }
}
