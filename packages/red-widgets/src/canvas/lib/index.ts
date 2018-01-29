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
  Context,
  $
} from '../../context'

import * as $d3 from '../lib/d3'
import * as d3Select from '../lib/d3-selection'

const {
  log
} = console

const d3 = Object.assign({}, $d3, d3Select)

import { CanvasConfiguration } from './configuration';
import { CanvasZoomer } from './zoomer';
import { CanvasSelectionManager } from './selection-manager';
import { CanvasTextCalculator } from './text-calculator';

import { CanvasKeyboard } from './keyboard';

import {
  CanvasMouse,
  CanvasNodeMouse,
  CanvasPortMouse
} from './mouse';

import { CanvasNodeManager } from './node-manager';
import { CanvasDrawer } from './drawer';
import {
  CanvasTouchMenuManager,
} from './touch';
import { CanvasGridManager } from './grid-manager';
import { CanvasNodeImporter } from './node-importer';
import { CanvasTouchEventHandler } from './touch/event-handler';
import { CanvasDragLineManager } from './drag-line-manager';
import { CanvasButtonManager } from './button-manager';
import { CanvasEventManager } from './event-manager';

export interface ICanvas {
  configure()
  /**
   * show Drag Lines
   * @param nodes
   */
  showDragLines(nodes)
  /**
   * hide Drag Lines
   */
  hideDragLines()
  /**
   * handle Outer Touch End Event
   * @param touchStartTime
   * @param lasso
   * @param canvasMouseUp
   */
  handleOuterTouchEndEvent(touchStartTime, lasso, canvasMouseUp)
  /**
   * handle Outer Touch Start Event
   * @param touchStartTime
   * @param startTouchCenter
   * @param scaleFactor
   * @param startTouchDistance
   * @param touchLongPressTimeout
   */
  handleOuterTouchStartEvent(touchStartTime,
    startTouchCenter,
    scaleFactor,
    startTouchDistance,
    touchLongPressTimeout)
  /**
   * portMouseDown
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseDown(d, portType, portIndex)
  /**
   * port Mouse Up
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseUp(d, portType, portIndex)
  /**
   * select All
   */
  selectAll()
  /**
   * clear Selection
   */
  clearSelection()
  /**
 * update Selection
 */
  updateSelection()
  clearTimeout(timer)
  /**
   * zoom In
   */
  zoomIn()
  /**
   * zoom Out
   */
  zoomOut()
  /**
   * zoom Zero
   */
  zoomZero()
  /**
   * canvas Mouse Move
   */
  canvasMouseMove()
  canvasMouseDown()
  canvasMouseUp()
  handleD3MouseDownEvent(evt)
  /**
   * handle Outer Touch MoveEvent
   * Use touchEventHandler: TouchEventHandler delegate class
   * @param touchStartTime
   * @param startTouchCenter
   * @param lasso
   * @param canvasMouseMove
   * @param oldScaleFactor
   * @param scaleFactor
   * @param startTouchDistance
   */
  handleOuterTouchMoveEvent(touchStartTime,
    startTouchCenter,
    lasso,
    canvasMouseMove,
    oldScaleFactor,
    scaleFactor,
    startTouchDistance)
  /**
   * reset Mouse Variables
   */
  resetMouseVars()
  /**
 * node Mouse Up handler
 * @param d
 */
  nodeMouseUp(d)
  /**
   * node Mouse Down handler
   * @param d
   */
  nodeMouseDown(d)
  // CanvasGridManager
  /**
   * update canvas Grid
   */
  updateGrid()
  /**
   * end Keyboard Move
   */
  endKeyboardMove()
  /**
   * update Active Nodes
   */
  updateActiveNodes()
  /**
   * Add node
   * @param type
   * @param x
   * @param y
   */
  addNode(type: any, x: any, y: any)
  /**
   * move Selection
   * @param dx
   * @param dy
   */
  moveSelection(dx, dy)
  /**
    * copy Selection
    */
  copySelection()
  /**
   * edit Selection
   */
  editSelection()
  /**
   * delete Selection
   */
  deleteSelection()
  /**
   * calculate Text Width
   * @param str
   * @param className
   * @param offset
   */
  calculateTextWidth(str, className, offset)
  /**
   * get element position of node
   * @param node
   */
  getNodeElementPosition(node)
  /**
   * get Port Label
   * @param node
   * @param portType
   * @param portIndex
   */
  getPortLabel(node, portType, portIndex)
  /**
   * port Mouse Out
   * @param port
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseOut(port, d, portType, portIndex)
  /**
     * port Mouse Over
     * @param port
     * @param d
     * @param portType
     * @param portIndex
     */
  portMouseOver(port, d, portType, portIndex)
  /**
   * disable Quick Join Event Handler
   * @param evt
   */
  disableQuickJoinEventHandler(evt)
  /**
   * handle WorkSpace Change Event
   * @param event
   * @param workspaceScrollPositions
   */
  handleWorkSpaceChangeEvent(event, workspaceScrollPositions)
  /**
   * check if Button is Enabled
   * @param d
   */
  isButtonEnabled(d): boolean
  /**
   * Node button click handler
   * @param d
   */
  nodeButtonClicked(d)
  /**
   * show Touch Menu (touch devices only)
   * @param obj
   * @param pos
   */
  showTouchMenu(obj, pos)
  /**
   * (Re)draw canvas
   * @param updateActive
   */
  redraw(updateActive?: boolean)
  focusView()
  /**
   * Imports a new collection of nodes from a JSON String.
   *  - all get new IDs assigned
   *  - all 'selected'
   *  - attached to mouse for placing - 'IMPORT_DRAGGING'
   */
  importNodes(newNodesStr, addNewFlow?, touchImport?)
  toggleStatus(s)
  // API
  state(state)
  /**
   * make a selection
   */
  selection()
  /**
   * Select a selection
   * @param selection
   */
  select(selection)
  scale()
  getLinksAtPoint(x, y)
}

export class Canvas extends Context {
  PORT_TYPE_INPUT = 1;
  PORT_TYPE_OUTPUT = 0;

  lasso: any
  oldScaleFactor: any
  scrollTop: any;
  scrollLeft: any;
  outer: any;
  vis: any;
  dragGroup: any;
  grid: any;
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
  selected_link = null
  mouse_position = null
  mousedown_port_type = null
  mousedown_port_index = 0
  clickElapsed = 0
  mouse_offset = [0, 0]
  mouseup_node: any = null
  showStatus: any = false
  lastClickNode: any = null
  dblClickPrimed: any = null
  clickTime = 0
  activeSpliceLink: any
  spliceActive = false
  spliceTimer: any
  outer_background: any
  touchLongPressTimeout = 1000
  startTouchDistance = 0
  startTouchCenter = []
  moveTouchCenter = []
  touchStartTime: any = 0
  space_width = 5000
  space_height = 5000
  lineCurveScale = 0.75
  scaleFactor = 1
  snapGrid = false
  clipboard = ''
  status_colours = {
    'red': '#c00',
    'green': '#5a8',
    'yellow': '#F9DF31',
    'blue': '#53A3F3',
    'grey': '#d3d3d3'
  }

  // TODO: use (service) injection
  protected canvasMouse: CanvasMouse = new CanvasMouse(this)
  protected canvasPostMouse: CanvasPortMouse = new CanvasPortMouse(this)
  protected keyboard: CanvasKeyboard = new CanvasKeyboard(this)

  protected configuration: CanvasConfiguration = new CanvasConfiguration(this)
  protected zoomer: CanvasZoomer = new CanvasZoomer(this)
  protected selectionManager: CanvasSelectionManager = new CanvasSelectionManager(this)
  protected calculator: CanvasTextCalculator = new CanvasTextCalculator(this)
  protected nodeMouse: CanvasNodeMouse = new CanvasNodeMouse(this)
  protected nodeManager: CanvasNodeManager = new CanvasNodeManager(this)
  protected drawer: CanvasDrawer = new CanvasDrawer(this)
  protected touchMenuManager: CanvasTouchMenuManager = new CanvasTouchMenuManager(this)
  protected gridManager: CanvasGridManager = new CanvasGridManager(this)
  protected nodesImporter: CanvasNodeImporter = new CanvasNodeImporter(this)
  protected touchEventHandler: CanvasTouchEventHandler = new CanvasTouchEventHandler(this)
  protected dragLineManager: CanvasDragLineManager = new CanvasDragLineManager(this)
  protected eventManager: CanvasEventManager = new CanvasEventManager(this)
  protected buttonManager: CanvasButtonManager = new CanvasButtonManager(this)

  constructor() {
    super()
    this.configure()
  }

  /**
   * Factory
   */
  static init() {
    return new Canvas().configure()
  }

  /**
   * Configure Canvas
   */
  configure() {
    this.configuration.configure()
  }

  /**
   * show Drag Lines
   * @param nodes
   */
  showDragLines(nodes) {
    this.dragLineManager.showDragLines(nodes)
  }

  /**
   * hide Drag Lines
   */
  hideDragLines() {
    this.dragLineManager.hideDragLines()
  }

  /**
   * handle Outer Touch End Event
   * @param touchStartTime
   * @param lasso
   * @param canvasMouseUp
   */
  handleOuterTouchEndEvent(touchStartTime, lasso, canvasMouseUp) {
    return this.touchEventHandler.handleOuterTouchEndEvent(touchStartTime, lasso, canvasMouseUp)
  }

  /**
   * handle Outer Touch Start Event
   * @param touchStartTime
   * @param startTouchCenter
   * @param scaleFactor
   * @param startTouchDistance
   * @param touchLongPressTimeout
   */
  handleOuterTouchStartEvent(touchStartTime,
    startTouchCenter,
    scaleFactor,
    startTouchDistance,
    touchLongPressTimeout) {
    return this.touchEventHandler.handleOuterTouchStartEvent(touchStartTime,
      startTouchCenter,
      scaleFactor,
      startTouchDistance,
      touchLongPressTimeout)
  }

  /**
   * portMouseDown
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseDown(d, portType, portIndex) {
    return this.canvasPostMouse.portMouseDown(d, portType, portIndex)
  }

  /**
   * port Mouse Up
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseUp(d, portType, portIndex) {
    return this.canvasPostMouse.portMouseUp(d, portType, portIndex)
  }

  /**
   * select All
   */
  selectAll() {
    return this.selectionManager.selectAll()
  }

  /**
   * clear Selection
   */
  clearSelection() {
    return this.selectionManager.clearSelection()
  }

  /**
 * update Selection
 */
  updateSelection() {
    return this.selectionManager.updateSelection()
  }

  /**
   * clear Timeout
   * @param timer
   */
  clearTimeout(timer) {
    clearTimeout(timer)
  }

  /**
   * zoom In
   */
  zoomIn() {
    this.zoomer.zoomIn()
  }

  /**
   * zoom Out
   */
  zoomOut() {
    this.zoomer.zoomOut()
  }

  /**
   * zoom Zero
   */
  zoomZero() {
    this.zoomer.zoomZero()
  }

  /**
   * canvas Mouse Move
   */
  canvasMouseMove() {
    this.canvasMouse.canvasMouseMove()
  }

  /**
   * canvas Mouse Down
   */
  canvasMouseDown() {
    this.canvasMouse.canvasMouseDown()
  }

  /**
   * canvas Mouse Up
   */
  canvasMouseUp() {
    this.canvasMouse.canvasMouseUp()
  }

  /**
   * handle D3 Mouse Down Event
   * @param evt
   */
  handleD3MouseDownEvent(evt) {
    this.canvasMouse.handleD3MouseDownEvent(evt)
  }

  /**
   * handle Outer Touch MoveEvent
   * Use touchEventHandler: TouchEventHandler delegate class
   * @param touchStartTime
   * @param startTouchCenter
   * @param lasso
   * @param canvasMouseMove
   * @param oldScaleFactor
   * @param scaleFactor
   * @param startTouchDistance
   */
  handleOuterTouchMoveEvent(touchStartTime,
    startTouchCenter,
    lasso,
    canvasMouseMove,
    oldScaleFactor,
    scaleFactor,
    startTouchDistance) {
    return this.touchEventHandler.handleOuterTouchMoveEvent(touchStartTime,
      startTouchCenter,
      lasso,
      canvasMouseMove,
      oldScaleFactor,
      scaleFactor,
      startTouchDistance)
  }

  /**
   * reset Mouse Variables
   */
  resetMouseVars() {
    return this.canvasMouse.resetMouseVars()
  }

  /**
 * node Mouse Up handler
 * @param d
 */
  nodeMouseUp(d) {
    this.nodeMouse.nodeMouseUp(d)
  }

  /**
   * node Mouse Down handler
   * @param d
   */
  nodeMouseDown(d) {
    this.nodeMouse.nodeMouseDown(d)
  }

  // CanvasGridManager
  /**
   * update canvas Grid
   */
  updateGrid() {
    this.gridManager.updateGrid()
  }

  /**
   * end Keyboard Move
   */
  endKeyboardMove() {
    return this.keyboard.endKeyboardMove()
  }

  /**
   * update Active Nodes
   */
  updateActiveNodes() {
    this.nodeManager.updateActiveNodes()
  }

  /**
   * Add node
   * @param type
   * @param x
   * @param y
   */
  addNode(type: any, x: any, y: any) {
    this.nodeManager.addNode(type, x, y)
  }

  /**
   * move Selection
   * @param dx
   * @param dy
   */
  moveSelection(dx, dy) {
    return this.selectionManager.moveSelection(dx, dy)
  }

  /**
   * copy Selection
   */
  copySelection() {
    return this.selectionManager.copySelection()
  }

  /**
   * edit Selection
   */
  editSelection() {
    return this.selectionManager.editSelection()
  }

  /**
   * delete Selection
   */
  deleteSelection() {
    return this.selectionManager.deleteSelection()
  }

  /**
   * calculate Text Width
   * @param str
   * @param className
   * @param offset
   */
  calculateTextWidth(str, className, offset) {
    return this.calculator.calculateTextWidth(str, className, offset)
  }

  /**
   * get element position of node
   * @param node
   */
  getNodeElementPosition(node) {
    return this.nodeManager.getNodeElementPosition(node)
  }

  /**
   * get Port Label
   * @param node
   * @param portType
   * @param portIndex
   */
  getPortLabel(node, portType, portIndex) {
    const {
      PORT_TYPE_INPUT
    } = this

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

  /**
   * port Mouse Out
   * @param port
   * @param d
   * @param portType
   * @param portIndex
   */
  portMouseOut(port, d, portType, portIndex) {
    this.canvasPostMouse.portMouseOut(port, d, portType, portIndex)
  }

  /**
     * port Mouse Over
     * @param port
     * @param d
     * @param portType
     * @param portIndex
     */
  portMouseOver(port, d, portType, portIndex) {
    this.canvasPostMouse.portMouseOver(port, d, portType, portIndex)
  }

  /**
   * disable Quick Join Event Handler
   * @param evt
   */
  disableQuickJoinEventHandler(evt) {
    return this.eventManager.disableQuickJoinEventHandler(evt)
  }

  /**
   * handle WorkSpace Change Event
   * @param event
   * @param workspaceScrollPositions
   */
  handleWorkSpaceChangeEvent(event, workspaceScrollPositions) {
    this.eventManager.handleWorkSpaceChangeEvent(event, workspaceScrollPositions)
  }

  /**
   * check if Button is Enabled
   * @param d
   */
  isButtonEnabled(d): boolean {
    return this.buttonManager.isButtonEnabled(d)
  }

  /**
   * Node button click handler
   * @param d
   */
  nodeButtonClicked(d) {
    return this.buttonManager.nodeButtonClicked(d)
  }

  /**
   * show Touch Menu (touch devices only)
   * @param obj
   * @param pos
   */
  showTouchMenu(obj, pos) {
    this.touchMenuManager.showTouchMenu(obj, pos)
  }

  /**
   * (Re)draw canvas
   * @param updateActive
   */
  redraw(updateActive?: boolean) {
    this.drawer.redraw(updateActive)
  }

  /**
   * Focus canvas view
   */
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
    return this.nodesImporter.importNodes(newNodesStr, addNewFlow, touchImport)
  }

  /**
   * toggle Status
   * @param s
   */
  toggleStatus(s) {
    this.showStatus = s;
    this.RED.nodes.eachNode(function (n) {
      n.dirty = true;
    });
    //TODO: subscribe/unsubscribe here
    this.redraw();
    return this
  }

  /**
   * Set mouse mode state
   * @param state
   */
  state(state) {
    if (state == null) {
      return this.mouse_mode
    } else {
      this.mouse_mode = state;
    }
    return this
  }

  /**
   * make a selection
   */
  selection() {
    return this.selectionManager.selection()
  }

  /**
   * Select a selection
   * @param selection
   */
  select(selection) {
    return this.selectionManager.select(selection)
  }

  /**
   * Get the scaleFactor
   */
  scale() {
    return this.scaleFactor
  }

  /**
   * get Links At Point (x,y)
   * @param x
   * @param y
   */
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
}
