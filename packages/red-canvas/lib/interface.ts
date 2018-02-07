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
  gridSize: any
  focus()
  reveal(id: number)
}
