import {
  Canvas,
  Context,
  container,
  delegateTarget,
  lazyInject,
  $TYPES,
} from './_base'


import { IHistory } from '@tecla5/red-runtime'

import {
  INodes,
  IWorkspaces,
  IMenu
} from '../../_interfaces'

const TYPES = $TYPES.all

export interface ICanvasEventManager {
  /**
   * Disable Quick Join Event Handler
   * @param evt
   */
  disableQuickJoinEventHandler(evt)

  /**
   * Handle Work Space Change Event
   * @param event
   * @param workspaceScrollPositions
   */
  handleWorkSpaceChangeEvent(event, workspaceScrollPositions)
}

@delegateTarget()
export class CanvasEventManager extends Context implements ICanvasEventManager {
  @lazyInject(TYPES.nodes) $nodes: INodes
  @lazyInject(TYPES.workspaces) $workspaces: IWorkspaces
  @lazyInject(TYPES.common.menu) $menu: IMenu

  constructor(protected canvas: Canvas) {
    super()
  }

  /**
   * disable Quick Join Event Handler
   * @param evt
   */
  disableQuickJoinEventHandler(evt) {
    const {
      RED,
      rebind,
      canvas
    } = this
    const {
      disableQuickJoinEventHandler
    } = this
    const {
      resetMouseVars,
      hideDragLines,
      redraw
    } = rebind([
        'resetMouseVars',
        'hideDragLines',
        'redraw'
      ], canvas)

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
    const {
      RED,
      canvas,
      rebind,

      $nodes,
      $menu,
      $workspaces
    } = this
    const {
      mouse_position
    } = canvas
    let {
      activeSubflow
    } = canvas
    const {
      clearSelection,
      updateSelection,
      updateActiveNodes,
      redraw,
    } = rebind([
        'clearSelection',
        'updateSelection',
        'updateActiveNodes',
        'redraw',
      ])


    var chart = $('#chart');
    if (event.old !== 0) {
      workspaceScrollPositions[event.old] = {
        left: chart.scrollLeft(),
        top: chart.scrollTop()
      };
    }
    var scrollStartLeft = chart.scrollLeft();
    var scrollStartTop = chart.scrollTop();

    activeSubflow = $nodes.subflow(event.workspace);

    $menu.setDisabled('menu-item-workspace-edit', activeSubflow);
    $menu.setDisabled('menu-item-workspace-delete', $workspaces.count == 1 || activeSubflow);

    if (workspaceScrollPositions[event.workspace]) {
      chart.scrollLeft(workspaceScrollPositions[event.workspace].left);
      chart.scrollTop(workspaceScrollPositions[event.workspace].top);
    } else {
      chart.scrollLeft(0);
      chart.scrollTop(0);
    }
    var scrollDeltaLeft = chart.scrollLeft() - scrollStartLeft;
    var scrollDeltaTop = chart.scrollTop() - scrollStartTop;
    if (mouse_position != null) {
      mouse_position[0] += scrollDeltaLeft;
      mouse_position[1] += scrollDeltaTop;
    }
    clearSelection();
    $nodes.eachNode(function (n) {
      n.dirty = true;
    });
    updateSelection();
    updateActiveNodes();
    redraw();
  }
}
