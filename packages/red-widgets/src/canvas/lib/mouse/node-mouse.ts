import {
  Context
} from '../../../context'
import { Canvas } from '../../';

export class CanvasNodeMouse extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * node Mouse Up handler
   * @param d
   */
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

  /**
   * node Mouse Down handler
   * @param d
   */
  nodeMouseDown(d) {
    this.focusView();
    //var touch0 = d3.event;
    //var pos = [touch0.pageX,touch0.pageY];
    //this.RED.touch.radialMenu.show(d3.select(this),pos);
    if (this.mouse_mode == this.RED.state.IMPORT_DRAGGING) {
      this.RED.keyboard.remove('escape');

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
        // TODO: Fixes?
        const svgElem = this.vis

        var mouse = d3.touches(svgElem)[0] || d3.mouse(svgElem);
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
}
