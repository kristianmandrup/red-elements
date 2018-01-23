import {
  Context
} from '../../context'
import { Canvas } from '../../';

export class CanvasEventManager extends Context {
  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * disable Quick Join Event Handler
   * @param evt
   */
  disableQuickJoinEventHandler(evt) {
    const {
      disableQuickJoinEventHandler
    } = this
    const {
      resetMouseVars,
      hideDragLines,
      redraw
    } = this.rebind([
        'resetMouseVars',
        'hideDragLines',
        'redraw'
      ])

    // Check for ctrl (all browsers), 'Meta' (Chrome/FF), keyCode 91 (Safari)
    if (evt.keyCode === 17 || evt.key === 'Meta' || evt.keyCode === 91) {
      resetMouseVars();
      hideDragLines();
      redraw();
      $(window).off('keyup', disableQuickJoinEventHandler);
    }
  }

  /**
   * handle WorkSpace Change Event
   * @param event
   * @param workspaceScrollPositions
   */
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
}
