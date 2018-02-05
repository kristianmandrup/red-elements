export interface ISearch {
  /**
   * Disable search
   */
  disable()

  /**
   * Enable search
   */
  enable()

  /**
   * ???
   * @param node
   */
  indexNode(node)

  /**
   * ???
   */
  indexWorkspace()

  /**
   * Search for the value and populate searchResults with matches
   * Searches all keys of all nodes for a match, using indexOf to find any substring match
   *
   * @param val { string } value to search for
   */
  search(val: string)

  /**
   * Ensure selected is visible
   * Scrolls selected into view if not visible in viewport
   */
  ensureSelectedIsVisible()

  /**
   * Create a search dialog with search input and results
   */
  createDialog()

  /**
   * Reveal a hidden node
   * @param node
   */
  reveal(node)

  /**
   * Show all ???
   * TODO: When is this called/used? after search is complete?
   */
  show()

  /**
   * See show
   *
   * TODO: add documentation - I think while searching, parts of UI are hidden?
   */
  hide()
}
