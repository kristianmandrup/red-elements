export interface IClipboard {
  configure()
  /**
   * setup Dialogs
   */
  setupDialogs()
  /**
   * export Nodes
   */
  exportNodes(clipboard)
  /**
   * import Nodes
   */
  importNodes()
  /**
   * validate Dialog Container
   */
  validateDialogContainer()
  /**
   * hide Drop Target
   */
  hideDropTarget()
  /**
   * copy text to clipboard
   * @param value
   * @param element
   * @param msg
   */
  copyText(value: any, element, msg: string)
}
