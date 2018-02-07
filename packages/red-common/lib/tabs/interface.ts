export interface ITabs {
  nextTab()

  previousTab()

  resize()

  scrollEventHandler(evt, dir)


  onTabClick()

  updateScroll()

  onTabDblClick()

  isActivated(id)

  activateTab(link)

  activatePreviousTab()

  activateNextTab()

  updateTabWidths()

  removeTab(id)

  ids: string[]

  addTabs(...tabs: Array<Object>)

  addTab(tab)

  count()

  countOnPage()

  contains(id)

  renameTab(id, label)

  order(order)

  handleAddButtonClickedEvent(evt, options)

  handleScrollMoveMouseClickEvent(evt)
}
